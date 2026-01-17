"use client";

import { motion } from "framer-motion";

interface TimelineItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

function TimelineItem({ title, description, icon, delay = 0 }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center px-4"
    >
      {/* Icon container */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center mb-4 relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-red-500/30 pulse-ring" />
        <div className="text-white">{icon}</div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-xs">{description}</p>
    </motion.div>
  );
}

export default function Timeline() {
  const items = [
    {
      title: "Early Detection",
      description: "AI-powered analysis identifies subtle valve abnormalities from heart sounds",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: "Accurate Diagnosis",
      description: "Deep learning models provide clinical-grade diagnostic accuracy",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Timely Treatment",
      description: "Earlier intervention leads to better patient outcomes",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Full Recovery",
      description: "Improved survival rates and quality of life for patients",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      {/* Timeline items */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <TimelineItem
            key={item.title}
            {...item}
            delay={index * 0.15}
          />
        ))}
      </div>
    </div>
  );
}
