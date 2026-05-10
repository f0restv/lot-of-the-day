import { getBestFinancing } from "@/lib/financing";
import { formatCurrency } from "@/lib/utils";

interface FinancingBadgeProps {
  variant?: "inline" | "card";
  price?: number;
  className?: string;
}

function formatMoney(amount: number): string {
  return formatCurrency(Math.round(amount));
}

export function FinancingBadge({ variant = "inline", price, className = "" }: FinancingBadgeProps) {
  const terms = price ? getBestFinancing(price) : null;

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
          {terms ? (
            <>
              <p className="text-sm text-foreground/70 leading-relaxed">
                As low as{" "}
                <span className="font-bold text-foreground">{formatMoney(terms.monthlyPayment)}/mo</span>{" "}
                with{" "}
                <span className="font-bold text-foreground">{formatMoney(terms.downPayment)} down</span>
                {" "}over {terms.termYears} year{terms.termYears === 1 ? "" : "s"}.
              </p>
              <p className="text-xs text-muted/80 mt-1.5 leading-relaxed">
                No credit check · 5% APR with 20% down · ${terms.docFee} doc fee · rates vary by terms
              </p>
            </>
          ) : (
            <p className="text-sm text-foreground/60 leading-relaxed">
              No bank, no credit check. 10% down minimum. Contact us for terms on this lot.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (terms) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-gold font-bold ${className}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Financing from {formatMoney(terms.monthlyPayment)}/mo
      </span>
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
