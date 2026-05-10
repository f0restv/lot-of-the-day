/**
 * Financing math based on Government Land Sales' published terms:
 *   - Minimum 10% down, "as low as 5%" rate with 20% down
 *   - In-house underwriting, no credit check
 *   - Term length scales by financed amount (tiers below)
 *   - $299 non-refundable doc fee
 *
 * Source: https://www.governmentlandsales.us/financing
 *
 * We display the best-case scenario (20% down, 5% rate, max term in the
 * customer's tier) framed as "as low as" — matches GLS's own framing
 * and stays honest about the upper bound.
 */

interface Tier {
  maxPrice: number;
  termYears: number;
}

const TERM_TIERS: Tier[] = [
  { maxPrice: 2500, termYears: 1 },
  { maxPrice: 5000, termYears: 2 },
  { maxPrice: 7500, termYears: 3 },
  { maxPrice: 10000, termYears: 4 },
  { maxPrice: 15000, termYears: 5 },
  { maxPrice: 20000, termYears: 6 },
  { maxPrice: 40000, termYears: 7 },
];

export const DOC_FEE = 299;
export const MIN_DOWN_PCT = 0.10;
export const BEST_RATE_DOWN_PCT = 0.20;
export const BEST_APR = 0.05;
export const MIN_FINANCEABLE_PRICE = 1500;

export interface FinancingTerms {
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  termMonths: number;
  termYears: number;
  apr: number;
  docFee: number;
}

function monthlyPaymentAt(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return principal;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/**
 * Best-case financing terms for a lot: 20% down at the lowest advertised rate
 * over the longest term the price tier allows. Returns null when the price
 * is below the financing floor or above the published tiers (>$40k requires
 * direct contact per GLS).
 */
export function getBestFinancing(price: number): FinancingTerms | null {
  if (!price || price < MIN_FINANCEABLE_PRICE) return null;
  const tier = TERM_TIERS.find((t) => price <= t.maxPrice);
  if (!tier) return null;

  const downPayment = price * BEST_RATE_DOWN_PCT;
  const financedAmount = price - downPayment;
  const termMonths = tier.termYears * 12;
  const monthlyPayment = monthlyPaymentAt(financedAmount, BEST_APR, termMonths);

  return {
    downPayment,
    financedAmount,
    monthlyPayment,
    termMonths,
    termYears: tier.termYears,
    apr: BEST_APR,
    docFee: DOC_FEE,
  };
}
