"use client";

import { Countdown } from "@/components/ui/countdown";

export function CountdownBanner() {
  return (
    <section className="relative z-10 bg-[#3A352F] py-12 md:py-20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center px-6">
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/50" />
          <p className="text-sm md:text-base tracking-[0.4em] uppercase text-gold-light font-medium">
            Time left to buy
          </p>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
        <Countdown />
      </div>
    </section>
  );
}
