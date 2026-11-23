import { roundCents } from "@/lib/calc/tax";

export function futureValueLumpSum(principal: number, annualRate: number, years: number): number {
  return roundCents(principal * Math.pow(1 + annualRate, years));
}

/** Effective monthly rate: (1 + annual)^(1/12) − 1 */
export function effectiveMonthlyRate(annualRate: number): number {
  if (annualRate === 0) return 0;
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Future value of monthly contributions with monthly compounding.
 * FV = monthly × ((1 + r_m)^months − 1) / r_m
 */
export function futureValueMonthlyContributions(
  monthly: number,
  annualRate: number,
  years: number,
): number {
  const months = Math.max(0, Math.round(years * 12));
  if (months === 0 || monthly === 0) return 0;
  const r = effectiveMonthlyRate(annualRate);
  if (r === 0) return roundCents(monthly * months);
  return roundCents((monthly * (Math.pow(1 + r, months) - 1)) / r);
}

/**
 * Traditional vs Roth on $1,000 of salary.
 * Traditional: invest the full $1,000 pre-tax, grow, tax at withdrawal.
 * Roth: pay tax now, invest what remains, withdraw tax-free.
 * When taxNow === taxLater and investments match, results are identical.
 */
export function traditionalVsRoth(options: {
  salaryDollars: number;
  taxNow: number;
  taxLater: number;
  annualReturn: number;
  years: number;
}): { traditionalAfterTax: number; rothAfterTax: number } {
  const traditionalGrown = futureValueLumpSum(options.salaryDollars, options.annualReturn, options.years);
  const traditionalAfterTax = roundCents(traditionalGrown * (1 - options.taxLater));

  const rothInvested = options.salaryDollars * (1 - options.taxNow);
  const rothAfterTax = futureValueLumpSum(rothInvested, options.annualReturn, options.years);

  return { traditionalAfterTax, rothAfterTax };
}
