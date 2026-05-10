"use client";

import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface TodaysLotProps {
  lot: Lot;
}

export function TodaysLot({ lot }: TodaysLotProps) {
  const details = [
    { label: "Access", value: lot.details.roadConditions },
    { label: "Water", value: lot.details.water },
    { label: "Zoning", value: lot.details.zoning },
    { label: "Taxes", value: `$${lot.details.annualTaxes}/yr` },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-foreground/10" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-muted font-bold">
              Property Details
            </span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
        </FadeIn>

        {/* Description + details in a clean grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Description — takes 3 cols on desktop */}
          <FadeIn className="lg:col-span-3">
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {lot.description}
            </p>
            <Link
              href={`/lot/${lot.date}`}
              className="inline-flex items-center gap-2 mt-8 text-gold font-bold text-sm tracking-wider uppercase hover:text-gold-dark transition-colors"
            >
              Full listing + photos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </FadeIn>

          {/* Quick details — 2 cols */}
          <FadeIn delay={0.15} className="lg:col-span-2">
            <div className="bg-surface-light rounded-2xl border border-foreground/5 p-6 lg:p-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted font-bold mb-6">
                At a Glance
              </h3>
              <div className="space-y-5">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between items-start gap-4">
                    <span className="text-xs tracking-wider uppercase text-muted shrink-0">
                      {d.label}
                    </span>
                    <span className="text-sm text-foreground text-right">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-foreground/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs tracking-wider uppercase text-muted">Price</span>
                  <span className="text-2xl font-serif font-bold text-gold">
                    {formatCurrency(lot.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-wider uppercase text-muted">Size</span>
                  <span className="text-lg font-serif font-bold text-foreground">
                    {formatAcreage(lot.acreage)} acres
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Photo strip — horizontal scroll on mobile, grid on desktop */}
        <FadeIn delay={0.3}>
          <div className="mt-12 -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="flex gap-3 lg:grid lg:grid-cols-4 lg:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:pb-0 scrollbar-hide">
              {lot.media.photos.map((photo, i) => (
                <Link
                  key={i}
                  href={`/lot/${lot.date}`}
                  className="relative shrink-0 w-[75vw] sm:w-[50vw] lg:w-auto aspect-[4/3] overflow-hidden rounded-xl snap-start group"
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
