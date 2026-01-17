"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ValveCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function ValveCard({
  icon,
  title,
  description,
  delay = 0,
}: ValveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
      className="valve-card group"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-blue-500/30 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
}
