"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

interface HeroProps {
  lot: Lot;
}

export function Hero({ lot }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {lot.media.video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={lot.media.poster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={lot.media.video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center animate-ken-burns"
          style={{ backgroundImage: `url(${lot.media.poster})` }}
        />
      )}

      <div className="absolute inset-0 gradient-overlay-full" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold-light mb-4 block">
            Today&apos;s Featured Lot
          </span>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-tight mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {lot.name}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 mt-4 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {lot.tagline}
        </motion.p>

        <motion.div
          className="flex items-center gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-serif font-bold text-gold-light">
              {formatCurrency(lot.price)}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-xl md:text-2xl font-serif text-white">
              {formatAcreage(lot.acreage)} acres
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Link
            href={`/lot/${lot.date}`}
            className="inline-flex items-center gap-2 bg-gold text-white px-10 py-4 text-sm tracking-wider uppercase font-medium hover:bg-gold-dark transition-colors duration-300 rounded-full"
          >
            View This Lot
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
