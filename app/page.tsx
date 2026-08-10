"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

/* ─── Garis ECG: motif halus, warna aksen ─── */
function EcgTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 120"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 60 H150 l12 -34 10 54 14 -66 12 46 10 -20 H320 l12 -34 10 54 14 -66 12 46 10 -20 H490 l12 -34 10 54 14 -66 12 46 10 -20 H640"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="ecg-anim"
        style={{ strokeDasharray: 240, strokeDashoffset: 0 }}
      />
    </svg>
  );
}

/* ─── Navigasi ─── */
const NAV_LINKS = [
  { href: "#what-is-vhd", label: "The Condition" },
  { href: "#risks", label: "Risks" },
  { href: "#symptoms", label: "Symptoms" },
  { href: "#detection", label: "Early Detection" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-accent">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            VHD Detection<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/demo"
            className="rounded-[6px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Open analyzer
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-hairline text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-bg md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-hairline py-3 text-sm font-medium text-ink-dim hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-[6px] bg-accent px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Open analyzer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero: klasik, centered, ECG halus di bawah ─── */
function Hero() {
  const reduce = !!useReducedMotion();
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 text-center sm:px-6 md:pb-20 md:pt-40">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.22em] text-accent"
        >
          Understanding heart valve disease
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl md:text-[3.4rem]"
        >
          Valvular heart disease affects millions worldwide.
          <span className="text-accent"> Most never hear it coming.</span>
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-dim"
        >
          VHD occurs when one or more of the heart's four valves fail. Often
          silent in early stages, it can become serious if left undetected.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep active:scale-[0.98]"
          >
            Analyze a heart sound
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#what-is-vhd"
            className="inline-flex items-center justify-center rounded-[6px] border border-hairline px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink-dim"
          >
            Learn more
          </a>
        </motion.div>

        {/* Kartu instrumen: panel putih klasik */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-14 max-w-3xl border border-hairline bg-surface"
        >
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Heart sound signal
            </span>
            <span className="flex items-center gap-2 text-[11px] font-medium text-ink-faint">
              <span className="inline-block h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              REC
            </span>
          </div>
          <div className="px-6 py-8">
            <EcgTrace className="h-20 w-full text-accent" />
          </div>
          <div className="grid grid-cols-4 divide-x divide-hairline border-t border-hairline">
            {[
              { name: "Aortic", dot: "bg-accent" },
              { name: "Mitral", dot: "bg-sky-400" },
              { name: "Tricuspid", dot: "bg-violet-400" },
              { name: "Pulmonary", dot: "bg-teal-400" },
            ].map((v) => (
              <div key={v.name} className="px-3 py-3 text-center">
                <span className={`mx-auto mb-1.5 block h-2 w-2 ${v.dot}`} aria-hidden="true" />
                <span className="text-[11px] font-medium text-ink-dim">{v.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Reveal ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Header section klasik: centered ─── */
function SectionHeader({ title, intro }: { title: React.ReactNode; intro?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-dim">{intro}</p>}
    </Reveal>
  );
}

const VALVES = [
  { name: "Aortic Valve", path: "Left ventricle to aorta", dot: "bg-accent", desc: "Controls blood flow from the heart to the body." },
  { name: "Mitral Valve", path: "Left atrium to left ventricle", dot: "bg-sky-400", desc: "Regulates blood between the upper and lower left chambers." },
  { name: "Tricuspid Valve", path: "Right atrium to right ventricle", dot: "bg-violet-400", desc: "Controls flow between the upper and lower right chambers." },
  { name: "Pulmonary Valve", path: "Right ventricle to lungs", dot: "bg-teal-400", desc: "Manages blood flow from the heart to the lungs." },
];

const TYPES = [
  { name: "Stenosis", desc: "The valve narrows and stiffens, restricting blood flow." },
  { name: "Regurgitation", desc: "The valve does not close fully, so blood leaks backward." },
  { name: "Prolapse", desc: "Valve flaps bulge back into the upper chamber." },
];

const STATS = [
  { value: "2.5%", label: "Global prevalence", desc: "of the world's population is affected by VHD" },
  { value: "13%", label: "Adults over 75", desc: "have moderate to severe valve disease" },
  { value: "50%", label: "Undiagnosed cases", desc: "remain undetected until severe" },
];

const COMPARISON = [
  { name: "Valvular Heart Disease", risk: 85, accent: true },
  { name: "Coronary Artery Disease", risk: 75, accent: false },
  { name: "Heart Failure", risk: 70, accent: false },
  { name: "Arrhythmia", risk: 45, accent: false },
];

const SYMPTOMS = [
  "Shortness of breath during activity or when lying down",
  "Unusual tiredness or weakness, especially with exertion",
  "Irregular heartbeat, fluttering, or racing heart",
  "Feeling lightheaded, especially during physical activity",
];

const RISK_FACTORS = [
  "Risk increases significantly with advancing age",
  "Previous heart conditions raise valve disease risk",
  "Chronic hypertension puts strain on heart valves",
  "Past infections can cause lasting valve damage",
];

const BENEFITS = [
  "Higher survival rates with early treatment",
  "More treatment options available",
  "Lower risk of complications",
  "Better quality of life outcomes",
];

const SOURCES = [
  { org: "American Heart Association", desc: "Guidelines on heart valve disease diagnosis and treatment" },
  { org: "European Society of Cardiology", desc: "Clinical recommendations for valvular heart disease" },
  { org: "World Health Organization", desc: "Global cardiovascular disease statistics and prevention" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Nav />
      <Hero />

      {/* The Condition */}
      <section id="what-is-vhd" className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>Four valves keep the blood moving in one direction.</>}
            intro="Your heart has four valves that keep blood flowing the right way. When they are damaged or diseased, the heart has to work harder to pump blood effectively."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALVES.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.05}>
                <div className="h-full border border-hairline bg-surface p-6">
                  <span className={`inline-block h-2 w-2 ${v.dot}`} aria-hidden="true" />
                  <h3 className="mt-4 font-serif text-lg font-semibold">{v.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{v.path}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>Three ways a valve can fail.</>}
            intro="Each failure mode changes the sound of the heartbeat. That change is what the analyzer listens for."
          />
          <div className="mx-auto mt-14 max-w-3xl">
            {TYPES.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="grid gap-2 border-t border-hairline py-7 sm:grid-cols-[180px_1fr] sm:gap-10">
                  <h3 className="font-serif text-xl font-semibold">{t.name}</h3>
                  <p className="max-w-xl text-ink-dim">{t.desc}</p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-hairline" />
          </div>
        </div>
      </section>

      {/* Risks: stats */}
      <section id="risks" className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>The silent numbers.</>}
            intro="VHD often develops slowly without obvious symptoms, which is why early detection matters."
          />
          <div className="mt-14 grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bg-surface">
                <div className="h-full p-8 text-center sm:p-10">
                  <div className="font-serif text-5xl font-semibold text-accent sm:text-6xl">{s.value}</div>
                  <div className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink">{s.label}</div>
                  <p className="mt-2 text-sm text-ink-dim">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>VHD compared with other conditions.</>}
            intro="Relative cardiovascular mortality risk, based on clinical studies."
          />
          <div className="mx-auto mt-14 max-w-3xl space-y-8">
            {COMPARISON.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className={`text-sm font-semibold ${c.accent ? "text-ink" : "text-ink-dim"}`}>{c.name}</span>
                  <span className={`font-serif text-lg ${c.accent ? "font-semibold text-accent" : "text-ink-faint"}`}>{c.risk}%</span>
                </div>
                <div className="mt-2.5 h-2 bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.risk}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                    className={`h-full ${c.accent ? "bg-accent" : "bg-ink-faint/40"}`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
            Relative risk comparison based on clinical studies
          </p>
        </div>
      </section>

      {/* Symptoms & Risk Factors */}
      <section id="symptoms" className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>Know the signs.</>}
            intro="Recognizing early warning signs can lead to timely intervention and better health outcomes."
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-left">
                Common symptoms
              </h3>
              <ul className="mt-6 border-t border-hairline">
                {SYMPTOMS.map((s) => (
                  <li key={s} className="flex items-start gap-4 border-b border-hairline py-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
                    <span className="text-ink-dim">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-left">
                Risk factors
              </h3>
              <ul className="mt-6 border-t border-hairline">
                {RISK_FACTORS.map((r) => (
                  <li key={r} className="flex items-start gap-4 border-b border-hairline py-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
                    <span className="text-ink-dim">{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Early Detection */}
      <section id="detection" className="border-b border-hairline">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Why early detection matters.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-dim">
              When VHD is caught early, patients have more treatment options and
              better outcomes. Early intervention can prevent heart failure and
              improve quality of life.
            </p>
            <ul className="mt-8 border-t border-hairline">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-4 border-b border-hairline py-4">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
                  <span className="text-ink-dim">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-hairline bg-accent-tint p-8 sm:p-10">
              <h3 className="font-serif text-2xl font-semibold">A simple exam can change the outcome.</h3>
              <p className="mt-4 leading-relaxed text-ink-dim">
                If you experience symptoms or have risk factors, consult your
                healthcare provider. A heart sound examination could catch it early.
              </p>
              <a
                href="#learn-more"
                className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
              >
                Talk to a doctor
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trusted Sources */}
      <section id="learn-more" className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            title={<>Evidence-based information.</>}
            intro="Our information is based on peer-reviewed research and guidelines from leading health organizations."
          />
          <div className="mt-14 grid gap-px border border-hairline bg-hairline md:grid-cols-3">
            {SOURCES.map((s, i) => (
              <Reveal key={s.org} delay={i * 0.05} className="bg-surface">
                <div className="h-full p-8">
                  <h3 className="font-serif text-lg font-semibold">{s.org}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-accent">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <span className="font-serif text-lg font-semibold tracking-tight">
                VHD Detection<span className="text-accent">.</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-ink-dim transition-colors hover:text-ink">
                  {l.label}
                </a>
              ))}
              <Link href="/demo" className="text-accent transition-colors hover:text-accent-bright">
                Open analyzer
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-hairline pt-8">
            <div className="border border-hairline bg-bg p-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
                Medical disclaimer
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-ink-faint">
                The information on this website is for educational purposes only
                and is not a substitute for professional medical advice,
                diagnosis, or treatment. Always consult your physician or a
                qualified health provider with any questions about a medical
                condition.
              </p>
            </div>
            <p className="mt-8 text-center text-sm text-ink-faint">
              (C) 2026 Raflidev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
