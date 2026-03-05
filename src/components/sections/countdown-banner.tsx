"use client";

import { motion } from "motion/react";
import { Countdown } from "@/components/ui/countdown";

export function CountdownBanner() {
  return (
    <section className="relative z-10 bg-background py-12 md:py-20 overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/50" />
            <p className="text-sm md:text-base tracking-[0.4em] uppercase text-gold font-medium">
              Time left to buy
            </p>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </motion.div>
        <Countdown />
      </div>
    </section>
  );
}
