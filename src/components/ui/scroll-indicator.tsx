"use client";

import { motion } from "motion/react";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={() => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }}
    >
      <span className="text-xs tracking-[0.3em] uppercase text-white/50">
        Scroll
      </span>
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gold"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </motion.svg>
    </motion.div>
  );
}
