"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { TextReveal } from "@/components/animations/text-reveal";
import { AnimatedCounter } from "./animated-counter";
import { formatCurrency } from "@/lib/utils";
import type { Lot } from "@/types/lot";

interface PropertyDetailsProps {
  lot: Lot;
}

export function PropertyDetails({ lot }: PropertyDetailsProps) {
  return (
    <section className="relative bg-background py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Stat counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20 md:mb-28">
          <FadeIn delay={0}>
            <div className="text-center md:text-left">
              <AnimatedCounter
                value={lot.price}
                prefix="$"
                separator=","
                className="font-serif text-4xl md:text-5xl font-bold text-gold"
              />
              <p className="text-xs tracking-[0.2em] uppercase text-muted mt-2">
                Asking Price
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="text-center md:text-left">
              <AnimatedCounter
                value={lot.acreage}
                decimals={lot.acreage % 1 !== 0 ? 2 : 0}
                className="font-serif text-4xl md:text-5xl font-bold text-foreground"
              />
              <p className="text-xs tracking-[0.2em] uppercase text-muted mt-2">
                Acres
              </p>
            </div>
          </FadeIn>
          {lot.details.annualTaxes !== undefined && (
            <FadeIn delay={0.2}>
              <div className="text-center md:text-left">
                <AnimatedCounter
                  value={lot.details.annualTaxes}
                  prefix="$"
                  className="font-serif text-4xl md:text-5xl font-bold text-foreground"
                />
                <p className="text-xs tracking-[0.2em] uppercase text-muted mt-2">
                  Annual Taxes
                </p>
              </div>
            </FadeIn>
          )}
          <FadeIn delay={0.3}>
            <div className="text-center md:text-left">
              <p className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                {formatCurrency(Math.round(lot.price / lot.acreage))}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-muted mt-2">
                Per Acre
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Description */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
              About This Property
            </h2>
          </FadeIn>
          <TextReveal
            text={lot.description}
            className="text-lg md:text-xl leading-relaxed text-foreground/70"
          />
        </div>

        {/* Feature pills */}
        <FadeIn>
          <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6">
            Property Features
          </h3>
        </FadeIn>
        <div className="flex flex-wrap gap-3">
          {lot.features.map((feature, i) => (
            <FadeIn key={feature} delay={i * 0.05}>
              <span className="px-5 py-2.5 text-sm text-foreground/80 bg-surface-light border border-foreground/5 hover:border-gold/30 transition-colors duration-300">
                {feature}
              </span>
            </FadeIn>
          ))}
        </div>

        {/* Property details grid */}
        {lot.details && (
          <div className="mt-20 md:mt-28">
            <FadeIn>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-8">
                Property Details
              </h3>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
              {lot.details.terrain && (
                <DetailRow label="Terrain" value={lot.details.terrain} />
              )}
              {lot.details.roadConditions && (
                <DetailRow label="Road Access" value={lot.details.roadConditions} />
              )}
              {lot.details.utilities && (
                <DetailRow label="Utilities" value={lot.details.utilities} />
              )}
              {lot.details.water && (
                <DetailRow label="Water" value={lot.details.water} />
              )}
              {lot.details.sewer && (
                <DetailRow label="Sewer" value={lot.details.sewer} />
              )}
              {lot.details.zoning && (
                <DetailRow label="Zoning" value={lot.details.zoning} />
              )}
              {lot.details.subdivision && (
                <DetailRow label="Subdivision" value={lot.details.subdivision} />
              )}
              {lot.apn && <DetailRow label="APN" value={lot.apn} />}
              {lot.dimensions && (
                <DetailRow label="Dimensions" value={lot.dimensions} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <FadeIn>
      <div className="flex justify-between items-baseline py-3 border-b border-foreground/5">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-sm text-foreground font-medium">{value}</span>
      </div>
    </FadeIn>
  );
}
