import data from "@/data/testimonials.json";

export interface Testimonial {
  quote: string;
  name: string;
  location?: string;
  lotName?: string;
}

const testimonials = data as Testimonial[];

interface TestimonialsProps {
  className?: string;
  heading?: string;
}

export function Testimonials({ className = "", heading = "What buyers say" }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 bg-surface-light ${className}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-foreground/10" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-muted font-bold">
            {heading}
          </span>
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-surface border border-foreground/5 rounded-2xl p-6"
            >
              <blockquote className="text-foreground/80 leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm">
                <p className="font-bold text-foreground">{t.name}</p>
                {(t.location || t.lotName) && (
                  <p className="text-muted text-xs mt-0.5">
                    {[t.location, t.lotName].filter(Boolean).join(" · ")}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
