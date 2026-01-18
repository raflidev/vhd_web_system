"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { InteractiveHeart, MagneticButton, TextReveal } from "./components/GSAPAnimations";

// Animated Heart SVG Component
const HeartVisualization = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80">
    {/* Outer glow rings */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full rounded-full bg-red-50 gentle-pulse" />
    </div>
    <div className="absolute inset-4 flex items-center justify-center">
      <div className="w-full h-full rounded-full bg-red-100/50 gentle-pulse" style={{ animationDelay: "0.5s" }} />
    </div>

    {/* Heart Icon */}
    <div className="absolute inset-0 flex items-center justify-center float">
      <svg className="w-32 h-32 md:w-40 md:h-40 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>

    {/* Valve indicators */}
    <div className="absolute top-8 left-1/2 -translate-x-1/2">
      <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30" />
    </div>
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
      <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
    </div>
    <div className="absolute top-1/2 left-8 -translate-y-1/2">
      <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30" />
    </div>
    <div className="absolute top-1/2 right-8 -translate-y-1/2">
      <div className="w-3 h-3 rounded-full bg-teal-500 shadow-lg shadow-teal-500/30" />
    </div>
  </div>
);

// Statistic Card Component
const StatCard = ({ value, label, description }: { value: string; label: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 text-center"
  >
    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 mb-3">{value}</div>
    <div className="text-lg font-semibold text-gray-800 mb-3">{label}</div>
    <div className="text-sm text-gray-500">{description}</div>
  </motion.div>
);

// Icon Card Component
const IconCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex gap-4 sm:gap-5 p-5 sm:p-7 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Mobile Navigation Component
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#what-is-vhd", label: "What is VHD" },
    { href: "#risks", label: "Risks" },
    { href: "#symptoms", label: "Symptoms" },
    { href: "#detection", label: "Detection" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-base sm:text-lg">VHD Detection</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/demo"
            className="px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors active:scale-95"
          >
            Try Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <Link
                  href="/demo"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors active:scale-95"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Navigation */}
      <MobileNav />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="relative z-10">
              <motion.span
                {...fadeIn}
                className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6 border border-red-100"
              >
                Understanding Heart Valve Disease
              </motion.span>

              <motion.h1
                {...fadeIn}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Valvular Heart Disease Affects{" "}
                <span className="gradient-text">Millions</span> Worldwide
              </motion.h1>

              <motion.p
                {...fadeIn}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl"
              >
                Valvular heart disease (VHD) occurs when one or more of your heart valves don&apos;t
                work properly. Often silent in early stages, VHD can lead to serious complications
                if left undetected. Understanding the condition is the first step toward prevention.
              </motion.p>

              <motion.div
                {...fadeIn}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 relative z-20"
              >
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Analyze Heart Sound
                </Link>
                <a
                  href="#what-is-vhd"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-gray-200 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Heart Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end order-first lg:order-last pointer-events-none lg:pointer-events-auto"
            >
              <InteractiveHeart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is VHD Section */}
      <section id="what-is-vhd" className="section bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12 md:mb-20">
            <span className="text-red-500 font-medium text-sm uppercase tracking-wider">Understanding the Condition</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
              What is Valvular Heart Disease?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-4 sm:px-0">
              Your heart has four valves that keep blood flowing in the right direction.
              When these valves are damaged or diseased, it affects your heart&apos;s ability to pump blood effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: "Aortic Valve",
                location: "Left ventricle → Aorta",
                color: "bg-red-500",
                description: "Controls blood flow from the heart to the body"
              },
              {
                name: "Mitral Valve",
                location: "Left atrium → Left ventricle",
                color: "bg-blue-500",
                description: "Regulates blood between upper and lower left chambers"
              },
              {
                name: "Tricuspid Valve",
                location: "Right atrium → Right ventricle",
                color: "bg-purple-500",
                description: "Controls flow between upper and lower right chambers"
              },
              {
                name: "Pulmonary Valve",
                location: "Right ventricle → Lungs",
                color: "bg-teal-500",
                description: "Manages blood flow from heart to lungs"
              }
            ].map((valve, index) => (
              <motion.div
                key={valve.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl ${valve.color} flex items-center justify-center mb-5`}>
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{valve.name}</h3>
                <p className="text-xs text-gray-400 mb-3 font-medium">{valve.location}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{valve.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Types of VHD */}
          <motion.div {...fadeIn} className="mt-12 md:mt-20 bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-10 text-center">Common Types of Valve Problems</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Stenosis</h4>
                <p className="text-sm text-gray-600">Valve becomes narrowed and stiff, restricting blood flow</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Regurgitation</h4>
                <p className="text-sm text-gray-600">Valve doesn&apos;t close properly, causing blood to leak backward</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Prolapse</h4>
                <p className="text-sm text-gray-600">Valve flaps bulge or prolapse back into the upper chamber</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why VHD is Dangerous Section */}
      <section id="risks" className="section">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12 md:mb-20">
            <span className="text-red-500 font-medium text-sm uppercase tracking-wider">The Silent Threat</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
              Why VHD Deserves Attention
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Valvular heart disease often develops slowly without obvious symptoms,
              making early detection critical for better outcomes.
            </p>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-20">
            <StatCard
              value="2.5%"
              label="Global Prevalence"
              description="Of the world's population is affected by VHD"
            />
            <StatCard
              value="13%"
              label="Adults Over 75"
              description="Have moderate to severe valve disease"
            />
            <StatCard
              value="50%"
              label="Undiagnosed Cases"
              description="Many VHD cases remain undetected until severe"
            />
          </div>

          {/* Comparison Chart */}
          <motion.div {...fadeIn} className="bg-gray-50 rounded-2xl p-5 sm:p-8 md:p-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-10 text-center">
              VHD vs Other Cardiovascular Conditions
            </h3>
            <div className="space-y-8">
              {[
                { name: "Valvular Heart Disease", mortality: 85, color: "bg-red-500", highlight: true },
                { name: "Coronary Artery Disease", mortality: 75, color: "bg-gray-400" },
                { name: "Heart Failure", mortality: 70, color: "bg-gray-400" },
                { name: "Arrhythmia", mortality: 45, color: "bg-gray-400" },
              ].map((condition, index) => (
                <motion.div
                  key={condition.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${condition.highlight ? "bg-white shadow-sm rounded-xl p-5 border-l-4 border-red-500" : "px-2"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1 sm:gap-0">
                    <span className={`font-medium text-sm sm:text-base ${condition.highlight ? "text-gray-900" : "text-gray-600"}`}>
                      {condition.name}
                      {condition.highlight && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Focus Area</span>
                      )}
                    </span>
                    <span className={`text-sm ${condition.highlight ? "font-semibold text-red-600" : "text-gray-500"}`}>
                      {condition.mortality}% relative risk
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${condition.mortality}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${condition.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-8 text-center">
              * Relative cardiovascular mortality risk comparison based on clinical studies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Symptoms & Risk Factors */}
      <section id="symptoms" className="section bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12 md:mb-20">
            <span className="text-red-500 font-medium text-sm uppercase tracking-wider">Know the Signs</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
              Early Symptoms & Risk Factors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Recognizing early warning signs can lead to timely intervention and better health outcomes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Symptoms */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Common Symptoms
              </h3>
              <div className="space-y-5">
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                  title="Shortness of Breath"
                  description="Difficulty breathing during activity or when lying down"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  title="Fatigue"
                  description="Unusual tiredness or weakness, especially with exertion"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                  title="Heart Palpitations"
                  description="Irregular heartbeat, fluttering, or racing heart"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  title="Dizziness or Fainting"
                  description="Feeling lightheaded, especially during physical activity"
                />
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Risk Factors
              </h3>
              <div className="space-y-5">
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  title="Age Over 65"
                  description="Risk increases significantly with advancing age"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                  title="History of Heart Disease"
                  description="Previous heart conditions increase valve disease risk"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  title="High Blood Pressure"
                  description="Chronic hypertension puts strain on heart valves"
                />
                <IconCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
                  title="Rheumatic Fever History"
                  description="Past infections can cause lasting valve damage"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Early Detection Matters */}
      <section id="detection" className="section">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <motion.div {...fadeIn}>
              <span className="text-red-500 font-medium text-sm uppercase tracking-wider">Prevention is Key</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6 md:mb-8">
                Why Early Detection Matters
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8 md:mb-10 leading-relaxed">
                When VHD is caught early, patients have more treatment options and better outcomes.
                Early intervention can prevent heart failure, reduce the need for emergency surgery,
                and significantly improve quality of life.
              </p>

              <div className="space-y-5">
                {[
                  "Higher survival rates with early treatment",
                  "More treatment options available",
                  "Lower risk of complications",
                  "Better quality of life outcomes",
                  "Reduced healthcare costs"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-base sm:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Take Action Today
                </h3>
                <p className="text-gray-600 mb-8">
                  If you experience any symptoms or have risk factors, consult your healthcare provider.
                  A simple heart sound examination could save your life.
                </p>
                <a
                  href="#learn-more"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                >
                  Talk to a Doctor
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Sources */}
      <section id="learn-more" className="section bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <span className="text-red-500 font-medium text-sm uppercase tracking-wider">Evidence-Based</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
              Trusted Sources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Our information is based on peer-reviewed research and guidelines from leading health organizations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-3">American Heart Association</h3>
              <p className="text-gray-600 leading-relaxed">Guidelines on heart valve disease diagnosis and treatment</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-3">European Society of Cardiology</h3>
              <p className="text-gray-600 leading-relaxed">Clinical recommendations for valvular heart disease</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-3">World Health Organization</h3>
              <p className="text-gray-600 leading-relaxed">Global cardiovascular disease statistics and prevention</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-16 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="font-semibold text-lg">VHD Detection System</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
              <a href="#what-is-vhd" className="text-gray-400 hover:text-white transition-colors">About VHD</a>
              <a href="#risks" className="text-gray-400 hover:text-white transition-colors">Risks</a>
              <a href="#symptoms" className="text-gray-400 hover:text-white transition-colors">Symptoms</a>
              <a href="#detection" className="text-gray-400 hover:text-white transition-colors">Detection</a>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="border-t border-gray-800 pt-10">
            <div className="bg-gray-800/50 rounded-xl p-5 sm:p-8 mb-8">
              <h4 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Medical Disclaimer
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                The information provided on this website is for educational purposes only and is not intended as a substitute
                for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
                qualified health provider with any questions you may have regarding a medical condition. Never disregard
                professional medical advice or delay in seeking it because of something you have read on this website.
              </p>
            </div>
            <p className="text-center text-sm text-gray-500">
              © 2026 Raflidev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main >
  );
}
