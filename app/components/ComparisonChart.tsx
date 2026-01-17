"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ComparisonItemProps {
  label: string;
  percentage: number;
  isHighlighted?: boolean;
  delay?: number;
}

function ComparisonItem({
  label,
  percentage,
  isHighlighted = false,
  delay = 0,
}: ComparisonItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="mb-6"
    >
      <div className="flex justify-between mb-2">
        <span
          className={`font-medium ${isHighlighted ? "text-red-400 text-lg" : "text-slate-400"
            }`}
        >
          {label}
        </span>
        <span
          className={`font-bold ${isHighlighted ? "text-red-400" : "text-slate-500"
            }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="comparison-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
          className={`comparison-bar-fill ${isHighlighted
              ? "bg-gradient-to-r from-red-600 to-red-400"
              : "bg-gradient-to-r from-slate-600 to-slate-500"
            }`}
        />
      </div>
    </motion.div>
  );
}

export default function ComparisonChart() {
  const comparisons = [
    { label: "Valvular Heart Disease (VHD)", percentage: 95, isHighlighted: true },
    { label: "Coronary Artery Disease", percentage: 72, isHighlighted: false },
    { label: "Arrhythmia", percentage: 58, isHighlighted: false },
    { label: "Heart Failure", percentage: 68, isHighlighted: false },
    { label: "Hypertensive Heart Disease", percentage: 45, isHighlighted: false },
  ];

  return (
    <div className="glass-card p-8 md:p-10">
      <h3 className="text-xl font-semibold text-white mb-2">
        Mortality Risk Comparison
      </h3>
      <p className="text-slate-400 text-sm mb-8">
        Relative cardiovascular mortality risk by condition
      </p>
      {comparisons.map((item, index) => (
        <ComparisonItem
          key={item.label}
          {...item}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
