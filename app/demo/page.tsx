"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { computeMFCC } from "../../lib/mfcc";
import Nav from "../components/Nav";
import WaveformPlayer from "../components/WaveformPlayer";

/* ─── Konstanta model ─── */
const MODEL_URL = "/models/vhd/model.json";
const SR = 22050;
const MAX_FRAMES = 100;
const CLASSES = ["AS", "MR", "MS", "MVP", "N"] as const;
type ClassLabel = (typeof CLASSES)[number];

const classInfo: Record<ClassLabel, { name: string; description: string; bar: string }> = {
  AS: { name: "Aortic Stenosis", description: "Penyempitan bukaan katup aorta", bar: "bg-rose-500" },
  MR: { name: "Mitral Regurgitation", description: "Aliran balik melalui katup mitral", bar: "bg-sky-500" },
  MS: { name: "Mitral Stenosis", description: "Penyempitan bukaan katup mitral", bar: "bg-violet-500" },
  MVP: { name: "Mitral Valve Prolapse", description: "Daun katup menonjol ke atrium kiri", bar: "bg-amber-500" },
  N: { name: "Normal", description: "Tidak ditemukan kelainan katup", bar: "bg-teal-500" },
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

/* ─── Panel instrumen klasik: header baris kecil + isi ─── */
function Panel({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-hairline bg-surface">
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          {title}
        </span>
        {right}
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}

export default function DemoPage() {
  const reduce = !!useReducedMotion();
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
        setError("Gagal memuat model di browser: " + (e instanceof Error ? e.message : String(e)));
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
      return { top: CLASSES[idx], probs, mfccMs: t1 - t0, inferMs: t2 - t1, file: fileName };
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
      const name = ex.file.split("/").pop() || "sample.wav";
      const f = new File([blob], name, { type: "audio/wav" });
      setFile(f);
      setResult(null);
      setError(null);
      runAudio(f, name);
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

  const statusDot =
    modelState === "ready" ? "bg-accent" : modelState === "error" ? "bg-red-600" : "bg-ink-faint";
  const statusText =
    modelState === "ready"
      ? "Model ready · LSTM 128 → 64 → 5 · running locally"
      : modelState === "error"
        ? "Model failed to load"
        : "Loading model...";

  return (
    <main className="min-h-screen bg-bg">
      <Nav />

      {/* Hero: klasik, centered, ECG halus */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-28 text-center sm:px-6 md:pt-32">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-accent"
          >
            In-browser inference
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl"
          >
            Heart sound analysis
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-dim"
          >
            Unggah rekaman bunyi jantung untuk mendeteksi kelainan katup. Model LSTM
            berjalan sepenuhnya di browser Anda — audio tidak dikirim ke server mana pun.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mx-auto mt-10 max-w-xl border border-hairline bg-surface px-5 py-3"
          >
            <span className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              <span className={`inline-block h-1.5 w-1.5 ${statusDot}`} aria-hidden="true" />
              {statusText}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10">
          {/* Panel input */}
          {!result ? (
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Panel
                title="Input audio"
                right={
                  <span className="flex items-center gap-2 text-[11px] font-medium text-ink-faint">
                    <span className={`inline-block h-1.5 w-1.5 ${isRunning ? "bg-accent" : statusDot}`} aria-hidden="true" />
                    {isRunning ? "Processing..." : "WAV · MP3 · OGG · FLAC · M4A"}
                  </span>
                }
              >
                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed px-8 py-12 text-center transition-colors ${
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
                  <p className="font-serif text-xl font-semibold text-ink">
                    Click or drop an audio file
                  </p>
                  <p className="mt-2 text-sm text-ink-faint">
                    Rekaman bunyi jantung, mono atau stereo
                  </p>
                </div>

                <div className="mt-6 border-t border-hairline pt-5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                    Or try a sample
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <button
                        key={ex.label}
                        onClick={() => handleExample(ex)}
                        disabled={modelState !== "ready" || isRunning}
                        className="rounded-[6px] border border-hairline px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Sample {ex.label} · {classInfo[ex.label].name}
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
            </motion.div>
          ) : (
            /* Panel hasil */
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Panel
                title="Result"
                right={
                  <span className="flex items-center gap-2 text-[11px] font-medium text-ink-faint">
                    <span className="inline-block h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                    100% in-browser
                  </span>
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                      Predicted condition
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink">
                      {classInfo[result.top].name}
                      <span className="text-accent"> ({result.top})</span>
                    </h2>
                    <p className="mt-1 text-sm text-ink-dim">{classInfo[result.top].description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-4xl font-semibold text-accent-deep">
                      {(result.probs[CLASSES.indexOf(result.top)] * 100).toFixed(1)}%
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                      Confidence
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="mt-6 border border-hairline bg-bg p-4">
                    <WaveformPlayer file={file} waveColor="#cbd5e1" progressColor="#175e7d" />
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {sorted.map(({ label, p }, i) => (
                    <div key={label} className="flex items-center gap-4">
                      <span
                        className={`w-10 shrink-0 text-sm font-bold ${
                          i === 0 ? "text-accent-deep" : "text-ink-dim"
                        }`}
                      >
                        {label}
                      </span>
                      <div className="h-2.5 flex-1 bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(p * 100, 0.5)}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full ${classInfo[label].bar}`}
                        />
                      </div>
                      <span
                        className={`w-14 shrink-0 text-right font-mono text-sm ${
                          i === 0 ? "font-semibold text-accent-deep" : "text-ink-dim"
                        }`}
                      >
                        {(p * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
                  <p className="font-mono text-xs text-ink-faint">
                    {result.file} · MFCC {result.mfccMs.toFixed(0)}ms · inferensi {result.inferMs.toFixed(0)}ms
                  </p>
                  <button
                    onClick={handleReset}
                    className="rounded-[6px] border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-dim"
                  >
                    Analyze another file
                  </button>
                </div>
              </Panel>
            </motion.div>
          )}

          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-ink-faint">
            Model: LSTM 128 → Dense 64 → 5 (softmax), input MFCC 100×13. Ekstraksi fitur memakai
            implementasi JavaScript yang disetarakan dengan librosa (selisih &lt; 1e-4). Hasil
            bersifat edukatif dan bukan pengganti diagnosis medis.
          </p>
        </div>
      </div>
    </main>
  );
}
