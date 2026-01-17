"use client";

import { motion } from "framer-motion";

export default function ECGLine() {
  const ecgPath = "M0,50 L20,50 L25,50 L30,20 L35,80 L40,35 L45,50 L50,50 L55,50 L60,45 L65,55 L70,50 L100,50 L120,50 L125,50 L130,20 L135,80 L140,35 L145,50 L150,50 L155,50 L160,45 L165,55 L170,50 L200,50 L220,50 L225,50 L230,20 L235,80 L240,35 L245,50 L250,50 L255,50 L260,45 L265,55 L270,50 L300,50";

  return (
    <div className="relative w-full h-24 overflow-hidden">
      <svg
        viewBox="0 0 300 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Gradient for ECG line */}
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* ECG line with animation */}
        <motion.path
          d={ecgPath}
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.5 },
          }}
        />

        {/* Glow effect */}
        <motion.path
          d={ecgPath}
          fill="none"
          stroke="#dc2626"
          strokeWidth="6"
          strokeLinecap="round"
          filter="blur(8px)"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
        />
      </svg>
    </div>
  );
}
