"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import WaveformPlayer from "../components/WaveformPlayer";

// Types
interface PredictionResult {
  filename: string;
  prediction: string;
  class_id: number;
  confidence: number;
  probabilities: {
    AS: number;
    MR: number;
    MS: number;
    MVP: number;
    N: number;
  };
}

interface HealthCheckResult {
  status: string;
  model_loaded: boolean;
  service: string;
  version: string;
}

// Example files
const exampleFiles = [
  { name: "Aortic Stenosis", filename: "New_AS_029.wav", type: "AS" },
  { name: "Mitral Regurgitation", filename: "New_MR_024.wav", type: "MR" },
  { name: "Mitral Stenosis", filename: "New_MS_033.wav", type: "MS" },
  { name: "Mitral Valve Prolapse", filename: "New_MVP_017.wav", type: "MVP" },
  { name: "Normal Heart", filename: "New_N_020.wav", type: "N" },
];

// Class info mapping
const classInfo: Record<string, { name: string; description: string; color: string; bgColor: string }> = {
  AS: {
    name: "Aortic Stenosis",
    description: "Narrowing of the aortic valve opening",
    color: "text-rose-600",
    bgColor: "bg-rose-500",
  },
  MR: {
    name: "Mitral Regurgitation",
    description: "Backward flow through the mitral valve",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
  },
  MS: {
    name: "Mitral Stenosis",
    description: "Narrowing of the mitral valve opening",
    color: "text-purple-600",
    bgColor: "bg-purple-500",
  },
  MVP: {
    name: "Mitral Valve Prolapse",
    description: "Valve flaps bulge into the left atrium",
    color: "text-amber-600",
    bgColor: "bg-amber-500",
  },
  N: {
    name: "Normal",
    description: "No valve abnormality detected",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
  },
};

// Probability Bar Component
const ProbabilityBar = ({
  label,
  fullName,
  probability,
  isHighest,
  color,
}: {
  label: string;
  fullName: string;
  probability: number;
  isHighest: boolean;
  color: string;
}) => {
  const percentage = (probability * 100).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl ${isHighest ? "bg-gray-100 ring-2 ring-offset-2 ring-gray-300" : "bg-gray-50"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className={`font-bold text-lg ${isHighest ? classInfo[label].color : "text-gray-700"}`}>
            {label}
          </span>
          <span className="text-sm text-gray-500">{fullName}</span>
        </div>
        <span className={`font-semibold ${isHighest ? classInfo[label].color : "text-gray-600"}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probability * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${isHighest ? color : "bg-gray-400"}`}
        />
      </div>
    </motion.div>
  );
};

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [isCheckingService, setIsCheckingService] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check API health on page load
  useEffect(() => {
    const checkHealth = async () => {
      setIsCheckingService(true);
      try {
        const response = await fetch("/api/health", {
          method: "GET",
          headers: {
            "accept": "application/json",
          },
        });

        if (response.ok) {
          const data: HealthCheckResult = await response.json();
          setServiceAvailable(data.status === "healthy" && data.model_loaded);
        } else {
          setServiceAvailable(false);
        }
      } catch {
        setServiceAvailable(false);
      } finally {
        setIsCheckingService(false);
      }
    };

    checkHealth();
  }, []);

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError("Please select a valid audio file (WAV, MP3, etc.)");
    }
  };

  // File input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleExampleDragStart = (e: React.DragEvent, filename: string) => {
    e.dataTransfer.setData("application/vhd-sound-example", filename);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Check for dragged example file
    const exampleFilename = e.dataTransfer.getData("application/vhd-sound-example");
    if (exampleFilename) {
      try {
        const response = await fetch(`/sound/${exampleFilename}`);
        if (!response.ok) throw new Error("Failed to load example file");

        const blob = await response.blob();
        const file = new File([blob], exampleFilename, { type: "audio/wav" });
        handleFileSelect(file);
      } catch (err) {
        setError("Failed to load example file");
        console.error(err);
      }
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Submit for prediction
  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state
  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get sorted probabilities
  const getSortedProbabilities = (probs: PredictionResult["probabilities"]) => {
    return Object.entries(probs)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ label: key, probability: value }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-lg">VHD Detection System</span>
          </Link>

          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-4 border border-red-100">
              AI-Powered Analysis
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Heart Sound Analysis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Upload a heart sound recording to detect potential valve abnormalities using our deep learning model.
            </p>
          </motion.div>

          {/* Service Status Banner */}
          <AnimatePresence>
            {isCheckingService && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm text-blue-700 font-medium">Checking service availability...</p>
              </motion.div>
            )}

            {!isCheckingService && serviceAvailable === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-6 rounded-xl bg-red-50 border-2 border-red-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Service Tidak Tersedia</h3>
                    <p className="text-red-700 mb-4">
                      VHD Audio Classification API sedang tidak aktif. Silakan coba beberapa saat lagi atau hubungi administrator.
                    </p>
                    <button
                      onClick={() => {
                        setIsCheckingService(true);
                        setServiceAvailable(null);
                        fetch("/api/health", {
                          method: "GET",
                          headers: { "accept": "application/json" },
                        })
                          .then(response => {
                            if (response.ok) {
                              return response.json();
                            }
                            throw new Error("Service unavailable");
                          })
                          .then((data: HealthCheckResult) => {
                            setServiceAvailable(data.status === "healthy" && data.model_loaded);
                          })
                          .catch(() => {
                            setServiceAvailable(false);
                          })
                          .finally(() => {
                            setIsCheckingService(false);
                          });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Coba Lagi
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Section */}
          {serviceAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
            >
              {!result ? (
                <>
                  {/* Upload Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                    relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                    ${dragActive
                        ? "border-red-400 bg-red-50"
                        : file
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }
                  `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                          className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove file
                        </button>
                        <div className="w-full mt-4">
                          <WaveformPlayer
                            file={file}
                            height={60}
                            waveColor="#4ade80"
                            progressColor="#16a34a"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          Drop your audio file here
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                          Supported formats: WAV, MP3, M4A, OGG
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Analyze Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!file || isLoading}
                    style={{
                      backgroundColor: file && !isLoading ? '#dc2626' : '#e5e7eb',
                      color: file && !isLoading ? '#ffffff' : '#6b7280',
                    }}
                    className="w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 hover:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span>Analyze Heart Sound</span>
                      </>
                    )}
                  </button>

                  {/* Example Files Section */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Try with Example Sounds
                    </h3>
                    <div className="grid gap-3">
                      {exampleFiles.map((example) => (
                        <div
                          key={example.filename}
                          draggable
                          onDragStart={(e) => handleExampleDragStart(e, example.filename)}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors cursor-grab active:cursor-grabbing"
                        >
                          <div className={`w-8 h-8 rounded-lg ${classInfo[example.type].bgColor} flex items-center justify-center flex-shrink-0 text-white font-bold text-xs`}>
                            {example.type}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {example.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              Drag to analyze box
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <WaveformPlayer
                              url={`/sound/${example.filename}`}
                              height={32}
                              waveColor={classInfo[example.type].color.replace("text-", "#").replace("-600", "500") || "#cbd5e1"}
                              progressColor="#ef4444"
                              minPxPerSec={10}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Results Section */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Result Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className={`w-20 h-20 rounded-2xl ${classInfo[result.prediction].bgColor} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                    <p className="text-gray-500">File: {result.filename}</p>
                  </div>

                  {/* Primary Result */}
                  <div className={`rounded-2xl p-6 mb-8 ${result.prediction === "N" ? "bg-emerald-50 border-2 border-emerald-200" : "bg-red-50 border-2 border-red-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Detected Condition</p>
                        <h3 className={`text-2xl font-bold ${classInfo[result.prediction].color}`}>
                          {classInfo[result.prediction].name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {classInfo[result.prediction].description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">Confidence</p>
                        <p className={`text-3xl font-bold ${classInfo[result.prediction].color}`}>
                          {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All Probabilities */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Class Probabilities</h3>
                    <div className="space-y-3">
                      {getSortedProbabilities(result.probabilities).map(({ label, probability }) => (
                        <ProbabilityBar
                          key={label}
                          label={label}
                          fullName={classInfo[label].name}
                          probability={probability}
                          isHighest={label === result.prediction}
                          color={classInfo[label].bgColor}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-amber-800">
                        <strong>Medical Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult a healthcare provider for proper evaluation.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-4 rounded-xl font-semibold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Analyze Another
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audio Format</h3>
              <p className="text-sm text-gray-600">
                Best results with clear WAV recordings of heart sounds taken with a digital stethoscope.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Model</h3>
              <p className="text-sm text-gray-600">
                Deep learning CNN trained on thousands of validated phonocardiogram samples.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">5 Conditions</h3>
              <p className="text-sm text-gray-600">
                Detects AS, MR, MS, MVP conditions and Normal heart sounds with high accuracy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main >
  );
}
