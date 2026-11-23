import { EMPLOYEE_401K_LIMIT, IRA_LIMIT } from "@/lib/rules/2026";
import type { ProjectorInput } from "@/lib/calc/projector";
import { defaultFilingStatus, defaultHealthPremiums, defaultStateTaxRate } from "@/lib/defaults";

/** Minimal answers we actually ask. */
export type PlanBasics = {
  age: number;
  salary: number;
  goalAmount: number;
  goalAge: number;
  onOptOrF1: boolean;
  shortHorizon: boolean;
  hasStudentLoans: boolean;
  loanBalance: number;
};

export const PLAN_BASIC_DEFAULTS: PlanBasics = {
  age: 27,
  salary: 150_000,
  goalAmount: 1_000_000,
  goalAge: 35,
  onOptOrF1: false,
  shortHorizon: false,
  hasStudentLoans: false,
  loanBalance: 0,
};

export const PLAN_ASSUMPTIONS = [
  "Investment return defaults to 7%/yr (long-run diversified stock assumption — not a prediction).",
  "Raises default to 4%/yr starting two years after job start.",
  "Bonus defaults to 10% of salary starting the year after job start.",
  "Employer retirement contribution defaults to 0% (employer-specific — adjust if you know it).",
  "Living costs default to about 25% of gross salary / 12.",
  "Emergency fund target defaults to 6 months of living costs on F-1/OPT, otherwise 3 months.",
  `Long-horizon path funds traditional 401(k) up to the $${EMPLOYEE_401K_LIMIT.toLocaleString("en-US")} IRS limit and Roth IRA up to $${IRA_LIMIT.toLocaleString("en-US")}.`,
  "Short-horizon path keeps employee 401(k) at $0 beyond whatever you set later, prioritizes flexible brokerage, and still models paycheck taxes.",
  "State tax defaults to 0%. Filing status defaults to single.",
] as const;

export function buildProjectorInput(basics: PlanBasics, now = new Date()): ProjectorInput {
  const birthYear = now.getFullYear() - Math.max(18, Math.min(80, Math.round(basics.age)));
  const jobStartYear = now.getFullYear();
  const jobStartMonth = now.getMonth() + 1;
  const livingMonthly = Math.round((basics.salary * 0.25) / 12);
  const emergencyMonths = basics.onOptOrF1 ? 6 : 3;
  const emergencyTarget = livingMonthly * emergencyMonths;
  const long = !basics.shortHorizon;

  return {
    birthYear,
    birthMonth: 1,
    jobStartYear,
    jobStartMonth,
    goalAmount: basics.goalAmount,
    goalAge: basics.goalAge,
    salary: basics.salary,
    raisePercent: 0.04,
    firstRaiseYear: jobStartYear + 2,
    bonusPercent: 0.1,
    firstBonusYear: jobStartYear + 1,
    employerContributionPercent: 0,
    filingStatus: defaultFilingStatus(),
    stateTaxRate: defaultStateTaxRate({}),
    optFicaExempt: basics.onOptOrF1,
    h1bStartYear: jobStartYear + (basics.onOptOrF1 ? 1 : 0),
    h1bStartMonth: 10,
    trad401kStartYear: jobStartYear + (basics.onOptOrF1 ? 1 : 0),
    roth401kPercentBefore: basics.onOptOrF1 ? 0.15 : 0,
    trad401kAnnual: long ? Math.min(EMPLOYEE_401K_LIMIT, basics.salary) : 0,
    rothIraAnnual: long || basics.salary > 0 ? Math.min(IRA_LIMIT, basics.salary) : 0,
    healthPremiums: defaultHealthPremiums(),
    livingMonthly,
    livingInflation: 0.03,
    emergencyTarget,
    emergencyMonthly: Math.min(2_000, Math.max(500, Math.round(emergencyTarget / 10))),
    hysaRate: 0.035,
    loanBalance: basics.hasStudentLoans ? Math.max(0, basics.loanBalance) : 0,
    loanRateBefore: 0.07,
    loanPaymentBefore: basics.hasStudentLoans && basics.loanBalance > 0
      ? Math.round((basics.loanBalance * 0.07) / 12)
      : 0,
    refinanceYear: jobStartYear + 1,
    refinanceMonth: 11,
    refinanceRate: 0.05,
    refinanceYears: 10,
    extraLoanPayment: 0,
    expectedReturn: 0.07,
    startBrokerage: 0,
    startRetirement: 0,
    startEmergency: 0,
  };
}

export function structureSummary(basics: PlanBasics): string[] {
  if (basics.shortHorizon) {
    return [
      "Protect cash for the next ~2 years outside the stock market.",
      "Take free employer retirement money if it exists; avoid locking extra dollars you may need after leaving the US.",
      "Prefer brokerage + HYSA for flexibility.",
      basics.onOptOrF1 ? "Keep a ~6-month emergency fund while on a visa." : "Keep a 3–6 month emergency fund.",
      basics.hasStudentLoans ? "List loan rates; pay high-rate balances faster on a short horizon." : "No student-loan balance modeled.",
    ];
  }
  return [
    "Protect first: emergency fund, then high-interest debt if any.",
    `Grow next: Roth IRA (up to $${IRA_LIMIT.toLocaleString("en-US")}/yr) and 401(k) (up to $${EMPLOYEE_401K_LIMIT.toLocaleString("en-US")}/yr employee limit).`,
    "Send leftover investing to a taxable brokerage for flexibility before 59½.",
    basics.onOptOrF1 ? "Model FICA carefully around OPT → H-1B; confirm with your school." : "Standard FICA assumed on wages.",
    "Review every January or after a big move (raise, visa, refinance).",
  ];
}
