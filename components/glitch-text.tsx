"use client";

import { motion } from "framer-motion";

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 text-primary opacity-0"
        animate={{ opacity: [0, 0.7, 0], x: [0, -2, 2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-accent opacity-0"
        animate={{ opacity: [0, 0.5, 0], x: [0, 2, -2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2, delay: 0.1 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
