"use client";

import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";
import { Countdown } from "@/components/ui/countdown";

interface TodaysLotProps {
  lot: Lot;
}

export function TodaysLot({ lot }: TodaysLotProps) {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-gold mb-3 block">
              {formatDate(lot.date)}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              Lot of the Day
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <Link href={`/lot/${lot.date}`} className="block group">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image
                  src={lot.media.poster}
                  alt={lot.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </Link>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted mb-2">
                  {lot.location.county} County, {lot.location.state}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  {lot.name}
                </h3>
                <p className="text-foreground/60 mt-2">{lot.tagline}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 border border-foreground/10">
                  <p className="text-xs tracking-wider uppercase text-muted mb-1">
                    Price
                  </p>
                  <p className="text-xl font-serif font-bold text-gold">
                    {formatCurrency(lot.price)}
                  </p>
                </div>
                <div className="bg-surface p-4 border border-foreground/10">
                  <p className="text-xs tracking-wider uppercase text-muted mb-1">
                    Acreage
                  </p>
                  <p className="text-xl font-serif font-bold text-foreground">
                    {formatAcreage(lot.acreage)} acres
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {lot.features.slice(0, 4).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs tracking-wider uppercase bg-surface-light text-muted px-3 py-1.5 border border-foreground/10"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <Link
                href={`/lot/${lot.date}`}
                className="inline-flex items-center gap-2 bg-gold text-background px-8 py-3.5 text-sm tracking-wider uppercase font-bold hover:bg-gold-dark transition-colors duration-300"
              >
                View Full Details
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
            </div>
          </FadeIn>
        </div>

      </div>

      {/* Countdown — full bleed */}
      <FadeIn delay={0.4}>
        <div className="mt-20 md:mt-28 bg-[#3A352F] py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold-light mb-8 md:mb-12">
              Next lot drops in
            </p>
            <Countdown />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
