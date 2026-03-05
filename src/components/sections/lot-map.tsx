"use client";

import { FadeIn } from "@/components/animations/fade-in";

interface LotMapProps {
  lat: number;
  lng: number;
  name: string;
}

export function LotMap({ lat, lng, name }: LotMapProps) {
  return (
    <section className="relative bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <FadeIn>
          <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-8">
            Location
          </h3>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="aspect-[16/9] md:aspect-[21/9] bg-surface border border-foreground/10 overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=12&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${name}`}
            />
          </div>
          <p className="text-xs text-muted mt-3">
            Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
