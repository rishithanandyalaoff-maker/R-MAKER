import { EMPLOYEE_401K_LIMIT } from "@/lib/rules/2026";

/**
 * Public-rule defaults and light conditionals.
 * Ask for as little as possible; fill the rest from IRS limits / common cases.
 */
export type ProfileHints = {
  /** Rough annual salary. Primary required input for pay tools. */
  salary?: number;
  /** Affects FICA default. */
  international?: boolean;
  /** If true and international, default OPT FICA exemption on. */
  onOptOrF1?: boolean;
  /** State tax. Unknown → 0 with a note to adjust. */
  stateTaxRate?: number;
  /** First partial year → prefer Roth 401(k) % later; for paycheck, keep traditional at 0 until they opt in. */
  firstPartialYear?: boolean;
};

export function defaultTraditional401k(_salary?: number, _hints?: ProfileHints): number {
  // Contribution amount is personal. Public source only gives the IRS limit (shown in UI).
  // Default to $0 so we never invent a savings choice for the user.
  void _salary;
  void _hints;
  return 0;
}

export function defaultHealthPremiums(): number {
  // Educational placeholder, not a personalized quote.
  return 3_000;
}

export function defaultOptFicaExempt(hints: ProfileHints): boolean {
  return Boolean(hints.international && hints.onOptOrF1);
}

export function defaultStateTaxRate(hints: ProfileHints): number {
  return hints.stateTaxRate ?? 0;
}

export function defaultFilingStatus(): "single" | "marriedJoint" {
  return "single";
}

export const ASSUMPTION_NOTES = {
  health: "Health premiums default to $3,000/yr (educational placeholder). Change only if you know yours.",
  state: "State tax defaults to 0% (e.g. TX, FL, WA). Add a rate if your state taxes wages.",
  traditional401k: `Traditional 401(k) defaults to $0. The IRS employee limit this year is $${EMPLOYEE_401K_LIMIT.toLocaleString("en-US")} — open optional details if you contribute.`,
  fica: "FICA exemption defaults on only when you mark F-1/OPT nonresident. Confirm with your school’s international office.",
} as const;
