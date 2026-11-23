import {
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  FEDERAL_BRACKETS,
  FilingStatus,
  MEDICARE_RATE,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  STANDARD_DEDUCTION,
} from "@/lib/rules/2026";

/** Progressive federal income tax on taxable income. */
export function federalIncomeTax(taxableIncome: number, status: FilingStatus): number {
  const income = Math.max(0, taxableIncome);
  const brackets = FEDERAL_BRACKETS[status];
  let tax = 0;
  let previous = 0;

  for (const bracket of brackets) {
    const top = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const slice = Math.min(income, top) - previous;
    if (slice > 0) tax += slice * bracket.rate;
    previous = top;
    if (income <= top) break;
  }

  return roundCents(tax);
}

export function taxableIncomeAfterStandardDeduction(agi: number, status: FilingStatus): number {
  return Math.max(0, agi - STANDARD_DEDUCTION[status]);
}

export function socialSecurityTax(wages: number): number {
  const taxable = Math.min(Math.max(0, wages), SOCIAL_SECURITY_WAGE_BASE);
  return roundCents(taxable * SOCIAL_SECURITY_RATE);
}

export function medicareTax(wages: number, status: FilingStatus): number {
  const base = Math.max(0, wages);
  let tax = base * MEDICARE_RATE;
  const extraBase = Math.max(0, base - ADDITIONAL_MEDICARE_THRESHOLD[status]);
  tax += extraBase * ADDITIONAL_MEDICARE_RATE;
  return roundCents(tax);
}

export function ficaTax(wages: number, status: FilingStatus, ficaExempt = false): number {
  if (ficaExempt) return 0;
  return roundCents(socialSecurityTax(wages) + medicareTax(wages, status));
}

export function marginalFederalRate(taxableIncome: number, status: FilingStatus): number {
  const income = Math.max(0, taxableIncome);
  for (const bracket of FEDERAL_BRACKETS[status]) {
    if (bracket.upTo === null || income <= bracket.upTo) return bracket.rate;
  }
  return FEDERAL_BRACKETS[status].at(-1)!.rate;
}

export function effectiveRate(tax: number, income: number): number {
  if (income <= 0) return 0;
  return tax / income;
}

export function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}
