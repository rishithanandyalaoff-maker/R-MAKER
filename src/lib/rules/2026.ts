/**
 * US federal tax-year 2026 numbers used across Money Basics.
 * TODO: Verify every number against IRS.gov before launch.
 * Sources listed on /sources.
 */
export const TAX_YEAR = 2026;

export const RULES_LABEL = `Rules as of tax year ${TAX_YEAR}`;

export type FilingStatus = "single" | "marriedJoint";

export type Bracket = { upTo: number | null; rate: number };

/** Federal ordinary-income brackets (taxable income). */
export const FEDERAL_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 12_400, rate: 0.1 },
    { upTo: 50_400, rate: 0.12 },
    { upTo: 105_700, rate: 0.22 },
    { upTo: 201_775, rate: 0.24 },
    { upTo: 256_225, rate: 0.32 },
    { upTo: 640_600, rate: 0.35 },
    { upTo: null, rate: 0.37 },
  ],
  marriedJoint: [
    { upTo: 24_800, rate: 0.1 },
    { upTo: 100_800, rate: 0.12 },
    { upTo: 211_400, rate: 0.22 },
    { upTo: 403_550, rate: 0.24 },
    { upTo: 512_450, rate: 0.32 },
    { upTo: 768_700, rate: 0.35 },
    { upTo: null, rate: 0.37 },
  ],
};

export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16_100,
  marriedJoint: 32_200,
};

/** Employee portion. */
export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE = 184_500;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  marriedJoint: 250_000,
};

/** Federal supplemental wage withholding rate (e.g. many bonuses). */
export const FEDERAL_SUPPLEMENTAL_RATE = 0.22;

export const EMPLOYEE_401K_LIMIT = 24_500;
export const IRA_LIMIT = 7_500;

/**
 * Traditional IRA deduction phase-out when covered by a workplace plan (MAGI).
 * TODO: Verify 2026 ranges against IRS.gov before launch.
 */
export const IRA_DEDUCTION_PHASE_OUT = {
  single: [81_000, 91_000] as [number, number],
};

/**
 * Roth IRA contribution income phase-out (MAGI).
 * TODO: Verify 2026 ranges against IRS.gov before launch.
 */
export const ROTH_IRA_PHASE_OUT = {
  single: [153_000, 168_000] as [number, number],
  marriedJoint: [242_000, 252_000] as [number, number],
  /** @deprecated alias — prefer marriedJoint */
  mfj: [242_000, 252_000] as [number, number],
};

export const LONG_TERM_CAPITAL_GAINS_HOLD_DAYS = 365;
