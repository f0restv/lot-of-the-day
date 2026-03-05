"use client";

import { Countdown } from "@/components/ui/countdown";

export function CountdownBanner() {
  return (
    <section className="relative z-10 bg-surface border-b border-gold/20 py-10 md:py-16">
      <div className="max-w-5xl mx-auto text-center px-6">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gold font-medium mb-6 md:mb-10">
          Time left to buy this lot
        </p>
        <Countdown />
      </div>
    </section>
  );
}
