"use client";

import { motion } from "motion/react";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import type { Lot } from "@/types/lot";

interface VideoHeroProps {
  lot: Lot;
}

export function VideoHero({ lot }: VideoHeroProps) {
  const hasVideo = !!lot.media.video;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Fixed media background */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={lot.media.poster}
            className="w-full h-full object-cover"
          >
            <source src={lot.media.video} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full animate-ken-burns"
            style={{
              backgroundImage: `url(${lot.media.poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 gradient-overlay-bottom" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold mb-4">
            {lot.location.county} County, {lot.location.state}
          </p>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {lot.name}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-foreground/70 font-light mb-8 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {lot.tagline}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-2xl md:text-3xl font-serif font-bold text-gold">
              {formatCurrency(lot.price)}
            </p>
            <p className="text-xs tracking-widest uppercase text-foreground/40 mt-1">
              Price
            </p>
          </div>
          <div className="w-px h-10 bg-foreground/10" />
          <div>
            <p className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {formatAcreage(lot.acreage)}
            </p>
            <p className="text-xs tracking-widest uppercase text-foreground/40 mt-1">
              Acres
            </p>
          </div>
          {lot.dimensions && (
            <>
              <div className="w-px h-10 bg-foreground/10" />
              <div>
                <p className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  {lot.dimensions}
                </p>
                <p className="text-xs tracking-widest uppercase text-foreground/40 mt-1">
                  Dimensions
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
