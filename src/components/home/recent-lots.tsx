"use client";

import Link from "next/link";
import Image from "next/image";
import type { Lot } from "@/types/lot";
import { formatCurrency, formatAcreage, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface RecentLotsProps {
  lots: Lot[];
}

export function RecentLots({ lots }: RecentLotsProps) {
  if (lots.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-gold mb-3 block">
                Recent
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Past Featured Lots
              </h2>
            </div>
            <Link
              href="/archive"
              className="text-sm tracking-wider uppercase text-muted hover:text-gold transition-colors hidden md:block"
            >
              View All
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lots.map((lot, i) => (
            <FadeIn key={lot.id} delay={i * 0.15}>
              <Link href={`/lot/${lot.date}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-light mb-4">
                  <Image
                    src={lot.media.poster}
                    alt={lot.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <p className="text-xs tracking-wider text-muted mb-1">
                  {formatDate(lot.date)}
                </p>
                <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                  {lot.name}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="text-gold font-medium">
                    {formatCurrency(lot.price)}
                  </span>
                  <span className="text-foreground/30">|</span>
                  <span className="text-muted">
                    {formatAcreage(lot.acreage)} acres
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-12 text-center md:hidden">
            <Link
              href="/archive"
              className="text-sm tracking-wider uppercase text-muted hover:text-gold transition-colors"
            >
              View All Past Lots
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
