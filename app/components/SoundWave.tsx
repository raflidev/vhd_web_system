"use client";

import { motion } from "framer-motion";

interface SoundWaveProps {
  barCount?: number;
  className?: string;
}

export default function SoundWave({ barCount = 20, className = "" }: SoundWaveProps) {
  return (
    <div className={`flex items-center justify-center gap-1 h-20 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        // Create a wave pattern with varying heights
        const baseDelay = Math.abs(i - barCount / 2) * 0.05;
        const randomHeight = 20 + Math.random() * 40;

        return (
          <motion.div
            key={i}
            className="w-1 md:w-1.5 rounded-full bg-gradient-to-t from-red-600 via-purple-500 to-blue-500"
            initial={{ height: 10 }}
            animate={{
              height: [10, randomHeight, 15, randomHeight * 0.7, 10],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: baseDelay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
