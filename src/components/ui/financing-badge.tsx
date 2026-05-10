interface FinancingBadgeProps {
  variant?: "inline" | "card";
  className?: string;
}

export function FinancingBadge({ variant = "inline", className = "" }: FinancingBadgeProps) {
  if (variant === "card") {
    return (
      <div className={`flex items-start gap-3 bg-surface-light border border-gold/30 rounded-2xl p-5 ${className}`}>
        <div className="shrink-0 w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mt-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold" aria-hidden>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-foreground mb-1">
            Owner financing available
          </h4>
          <p className="text-sm text-foreground/60 leading-relaxed">
            No bank, no credit check. Low down payment, fixed monthly payments. Contact us for terms on this lot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-gold font-bold ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Owner financing available
    </span>
  );
}
