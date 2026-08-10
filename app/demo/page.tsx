"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { computeMFCC } from "../../lib/mfcc";
import WaveformPlayer from "../components/WaveformPlayer";

/* ── Konstanta model ── */
const MODEL_URL = "/models/vhd/model.json";
const SR = 22050;
const MAX_FRAMES = 100;
const CLASSES = ["AS", "MR", "MS", "MVP", "N"] as const;
type ClassLabel = (typeof CLASSES)[number];

const classInfo: Record<ClassLabel, { name: string; description: string; bar: string }> = {
  AS: { name: "Aortic Stenosis", description: "Penyempitan bukaan katup aorta", bar: "bg-rose-500" },
  MR: { name: "Mitral Regurgitation", description: "Aliran balik melalui katup mitral", bar: "bg-blue-500" },
  MS: { name: "Mitral Stenosis", description: "Penyempitan bukaan katup mitral", bar: "bg-purple-500" },
  MVP: { name: "Mitral Valve Prolapse", description: "Daun katup menonjol ke atrium kiri", bar: "bg-amber-500" },
  N: { name: "Normal", description: "Tidak ditemukan kelainan katup", bar: "bg-emerald-500" },
};

const examples: { label: ClassLabel; file: string }[] = [
  { label: "AS", file: "/sound/New_AS_029.wav" },
  { label: "MR", file: "/sound/New_MR_024.wav" },
  { label: "MS", file: "/sound/New_MS_033.wav" },
  { label: "MVP", file: "/sound/New_MVP_017.wav" },
  { label: "N", file: "/sound/New_N_020.wav" },
];

interface Result {
  top: ClassLabel;
  probs: number[];
  mfccMs: number;
  inferMs: number;
  file: string;
}

export default function DemoPage() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [modelState, setModelState] = useState<"loading" | "ready" | "error">("loading");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const runSeq = useRef(0);

  /* ── Muat model TFJS ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setModelState("loading");
        const m = await tf.loadLayersModel(MODEL_URL);
        if (cancelled) return;
        setModel(m);
        setModelState("ready");
      } catch (e) {
        if (cancelled) return;
        setModelState("error");
        setError(
          "Gagal memuat model di browser: " +
            (e instanceof Error ? e.message : String(e))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Decode + resample ke 22050 Hz ── */
  const decodeResample = useCallback(async (buf: ArrayBuffer) => {
    audioCtxRef.current =
      audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    const decoded = await audioCtxRef.current.decodeAudioData(buf);
    const ch = decoded.getChannelData(0);
    if (decoded.sampleRate === SR) return ch;
    const len = Math.ceil((ch.length * SR) / decoded.sampleRate);
    const off = new OfflineAudioContext(1, len, SR);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start(0);
    const rendered = await off.startRendering();
    return rendered.getChannelData(0);
  }, []);

  /* ── Inferensi client-side ── */
  const predict = useCallback(
    async (samples: Float32Array, fileName: string): Promise<Result> => {
      if (!model) throw new Error("Model belum siap");
      const t0 = performance.now();
      const mfcc = computeMFCC(samples, SR);
      const t1 = performance.now();
      const input = tf.tensor2d(Array.from(mfcc), [MAX_FRAMES, 13]).expandDims(0);
      const out = model.predict(input) as tf.Tensor;
      const probs = Array.from(await out.data());
      const t2 = performance.now();
      input.dispose();
      out.dispose();
      const idx = probs.indexOf(Math.max(...probs));
      return {
        top: CLASSES[idx],
        probs,
        mfccMs: t1 - t0,
        inferMs: t2 - t1,
        file: fileName,
      };
    },
    [model]
  );

  /* ── Proses file ── */
  const runAudio = useCallback(
    async (blob: Blob, fileName: string) => {
      if (!model) {
        setError("Model belum siap. Tunggu beberapa saat.");
        return;
      }
      setIsRunning(true);
      setError(null);
      const seq = ++runSeq.current;
      try {
        const buf = await blob.arrayBuffer();
        const samples = await decodeResample(buf);
        const r = await predict(samples, fileName);
        if (seq === runSeq.current) setResult(r);
      } catch (e) {
        if (seq === runSeq.current) {
          setError("Gagal memproses audio: " + (e instanceof Error ? e.message : String(e)));
        }
      } finally {
        if (seq === runSeq.current) setIsRunning(false);
      }
    },
    [model, decodeResample, predict]
  );

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("audio/") && !/\.(wav|mp3|ogg|flac|m4a)$/i.test(f.name)) {
      setError("Pilih file audio yang valid (WAV, MP3, OGG, FLAC, M4A)");
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    runAudio(f, f.name);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFileSelect(f);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runAudio]
  );

  const handleExample = async (ex: { label: ClassLabel; file: string }) => {
    try {
      const resp = await fetch(ex.file);
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const blob = await resp.blob();
      const f = new File([blob], ex.file.split("/").pop() || "sample.wav", { type: "audio/wav" });
      setFile(f);
      setResult(null);
      setError(null);
      runAudio(f, ex.file.split("/").pop() || "");
    } catch (e) {
      setError("Gagal memuat sample: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sorted = result
    ? (Object.keys(classInfo) as ClassLabel[])
        .map((c) => ({ label: c, p: result.probs[CLASSES.indexOf(c)] }))
        .sort((a, b) => b.p - a.p)
    : [];

  const statusPill = {
    loading: { dot: "bg-ink-faint", text: "Memuat model...", cls: "" },
    ready: { dot: "bg-accent", text: "Model siap · LSTM 128 → 64 → 5", cls: " border-accent/40 bg-accent-tint text-accent-deep" },
    error: { dot: "bg-red-600", text: "Gagal memuat model", cls: " border-red-300 bg-red-50 text-red-800" },
  }[modelState];

  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="font-semibold text-ink text-lg">VHD Detection System</span>
          </Link>
          <Link href="/" className="text-ink-dim hover:text-ink text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-xl bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/30">
              In-browser inference
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-4">Heart Sound Analysis</h1>
            <p className="text-ink-dim max-w-2xl mx-auto text-lg">
              Unggah rekaman bunyi jantung untuk mendeteksi kelainan katup. Model LSTM berjalan sepenuhnya di browser Anda
              via TensorFlow.js — tidak ada audio yang dikirim ke server.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-hairline text-sm font-medium text-ink-dim bg-surface${statusPill.cls}`}>
              <span className={`w-2 h-2 rounded-full ${statusPill.dot}`} />
              {statusPill.text}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-xl shadow-sm border border-hairline p-8 mb-8"
          >
            {!result ? (
              <>
                <div
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    dragActive ? "border-accent bg-accent-tint" : "border-hairline hover:border-accent/60"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                    }}
                  />
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <p className="text-ink font-semibold text-lg mb-1">Klik atau taruh file audio di sini</p>
                  <p className="text-ink-faint text-sm">WAV, MP3, OGG, FLAC, M4A · mono atau stereo</p>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">atau coba sample</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <button
                        key={ex.label}
                        onClick={() => handleExample(ex)}
                        disabled={modelState !== "ready" || isRunning}
                        className="px-4 py-2 rounded-lg border border-hairline text-sm font-medium text-ink-dim hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Sample {ex.label} · {classInfo[ex.label].name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">Hasil analisis</p>
                    <h2 className="font-serif text-2xl font-semibold text-ink">
                      {classInfo[result.top].name}{" "}
                      <span className="text-accent">({result.top})</span>
                    </h2>
                    <p className="text-ink-dim text-sm">{classInfo[result.top].description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl font-bold text-accent-deep">
                      {(result.probs[CLASSES.indexOf(result.top)] * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-ink-faint">keyakinan</p>
                  </div>
                </div>

                {file && (
                  <div className="mb-6 rounded-xl border border-hairline p-4 bg-bg">
                    <WaveformPlayer file={file} waveColor="#cbd5e1" progressColor="#175e7d" />
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {sorted.map(({ label, p }, i) => (
                    <div key={label} className={`flex items-center gap-4 p-3 rounded-xl border ${i === 0 ? "border-accent/40 bg-accent-tint" : "border-hairline bg-bg"}`}>
                      <div className="w-12 shrink-0">
                        <span className={`font-bold ${i === 0 ? "text-accent-deep" : "text-ink-dim"}`}>{label}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(p * 100, 0.5)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${classInfo[label].bar}`}
                          />
                        </div>
                      </div>
                      <div className="w-14 shrink-0 text-right">
                        <span className={`font-mono text-sm ${i === 0 ? "text-accent-deep font-semibold" : "text-ink-dim"}`}>
                          {(p * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-hairline pt-4">
                  <p className="font-mono text-xs text-ink-faint">
                    {result.file} · MFCC {result.mfccMs.toFixed(0)}ms · inferensi {result.inferMs.toFixed(0)}ms · 100% di browser
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg border border-hairline text-sm font-medium text-ink-dim hover:border-accent hover:text-accent transition-colors"
                  >
                    Analisis file lain
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <p className="text-center text-ink-faint text-sm max-w-2xl mx-auto">
            Model: LSTM 128 → Dense 64 → 5 (softmax), input MFCC 100×13. Ekstraksi fitur menggunakan
            implementasi JavaScript yang disetarakan dengan librosa (selisih &lt; 1e-4). Hasil ini bersifat
            edukatif dan bukan pengganti diagnosis medis.
          </p>
        </div>
      </div>
    </main>
  );
}
