"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { Countdown } from "@/components/ui/countdown";
import { OPERATOR_PHONE } from "@/lib/constants";

interface HeroProps {
  lot: Lot;
}

export function Hero({ lot }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] w-full bg-background">
      {/* Mobile: image first, stacked layout */}
      {/* Desktop: side-by-side editorial split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100svh]">
        {/* Image side */}
        <div className="relative h-[60svh] lg:h-auto lg:min-h-[100svh] order-1 lg:order-2">
          <Image
            src={lot.media.poster}
            alt={lot.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Urgency badge floating on image */}
          <motion.div
            className="absolute top-20 lg:top-8 right-4 lg:right-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="bg-urgent text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
              <span className="text-xs font-bold tracking-wider uppercase">Today Only</span>
            </div>
          </motion.div>

          {/* Price tag floating bottom-left on image — mobile */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 lg:hidden bg-gradient-to-t from-black/60 to-transparent pt-16 pb-6 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs tracking-wider uppercase mb-1">
                  {lot.location.county} County, {lot.location.state}
                </p>
                <h1 className="font-serif text-3xl font-bold text-white leading-tight">
                  {lot.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif font-bold text-white">
                  {formatCurrency(lot.price)}
                </p>
                <p className="text-white/60 text-sm">{formatAcreage(lot.acreage)} acres</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content side */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 lg:px-16 xl:px-24 py-8 lg:py-20">
          {/* Mobile: compact. Desktop: editorial */}

          {/* Countdown — urgency front and center */}
          <motion.div
            className="mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-urgent animate-pulse-dot" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-urgent">
                Expires at midnight
              </span>
            </div>
            <div className="bg-surface-light border border-foreground/5 rounded-2xl p-5 lg:p-6">
              <Countdown />
            </div>
          </motion.div>

          {/* Lot details — desktop only (mobile shows on image) */}
          <motion.div
            className="hidden lg:block mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted mb-3">
              {lot.location.county} County, {lot.location.state}
            </p>
            <h1 className="font-serif text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-4">
              {lot.name}
            </h1>
            <p className="text-foreground/50 text-lg leading-relaxed max-w-lg">
              {lot.tagline}
            </p>
          </motion.div>

          {/* Price + acreage — desktop */}
          <motion.div
            className="hidden lg:flex items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div>
              <p className="text-xs tracking-wider uppercase text-muted mb-1">Price</p>
              <p className="text-3xl font-serif font-bold text-gold">
                {formatCurrency(lot.price)}
              </p>
            </div>
            <div className="w-px h-12 bg-foreground/10" />
            <div>
              <p className="text-xs tracking-wider uppercase text-muted mb-1">Size</p>
              <p className="text-3xl font-serif font-bold text-foreground">
                {formatAcreage(lot.acreage)} <span className="text-lg text-muted">acres</span>
              </p>
            </div>
          </motion.div>

          {/* Features — quick scan */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {lot.features.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="text-[11px] tracking-wider uppercase text-muted bg-surface-light px-3 py-1.5 rounded-full border border-foreground/5"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link
              href={`/lot/${lot.date}`}
              className="inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 text-sm tracking-wider uppercase font-bold rounded-full hover:bg-gold-dark transition-colors duration-300"
            >
              View Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            {OPERATOR_PHONE ? (
              <a
                href={`tel:+${OPERATOR_PHONE.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-foreground/70 px-8 py-4 text-sm tracking-wider uppercase font-bold rounded-full border border-foreground/15 hover:border-foreground/30 transition-colors duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Now
              </a>
            ) : lot.contact.email && (
              <a
                href={`mailto:${lot.contact.email}?subject=${encodeURIComponent(`Inquiry: ${lot.name}`)}`}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-foreground/70 px-8 py-4 text-sm tracking-wider uppercase font-bold rounded-full border border-foreground/15 hover:border-foreground/30 transition-colors duration-300"
              >
                Contact Now
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
