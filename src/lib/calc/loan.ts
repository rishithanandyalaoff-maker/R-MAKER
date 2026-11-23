import { roundCents } from "@/lib/calc/tax";

/** Standard amortizing loan payment. */
export function loanPayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return 0;
  if (annualRate === 0) return roundCents(principal / months);
  const r = annualRate / 12;
  const factor = Math.pow(1 + r, months);
  return roundCents((principal * r * factor) / (factor - 1));
}

export function totalInterestPaid(principal: number, annualRate: number, months: number): number {
  const payment = loanPayment(principal, annualRate, months);
  return roundCents(payment * months - principal);
}

export function futureValueAnnuity(payment: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return roundCents(payment * months);
  const factor = Math.pow(1 + monthlyRate, months);
  return roundCents(payment * ((factor - 1) / monthlyRate));
}

export function refinanceSavings(options: {
  balance: number;
  currentRate: number;
  newRate: number;
  years: number;
}): { currentPayment: number; newPayment: number; interestSaved: number } {
  const months = options.years * 12;
  const currentPayment = loanPayment(options.balance, options.currentRate, months);
  const newPayment = loanPayment(options.balance, options.newRate, months);
  const interestSaved = roundCents(
    totalInterestPaid(options.balance, options.currentRate, months) -
      totalInterestPaid(options.balance, options.newRate, months),
  );
  return { currentPayment, newPayment, interestSaved };
}

export type PayoffScenarioSnapshot = {
  investments: number;
  loanBalance: number;
  netWorth: number;
};

export type PayoffVsInvestSimResult = {
  requiredPayment: number;
  scenarioA: PayoffScenarioSnapshot;
  scenarioB: PayoffScenarioSnapshot;
  difference: number;
};

/**
 * Apples-to-apples: same cash each month (required + extra).
 * A = prepay loan with extra, then invest required+extra once paid off.
 * B = pay only required on the loan; invest the extra each month.
 */
export function simulatePayoffVsInvest(options: {
  principal: number;
  loanRate: number;
  requiredPayment?: number;
  termMonths?: number;
  extraMonthly: number;
  expectedReturn: number;
  years: number;
}): PayoffVsInvestSimResult {
  const termMonths = options.termMonths ?? Math.max(1, Math.round(options.years * 12));
  const requiredPayment =
    options.requiredPayment ?? loanPayment(options.principal, options.loanRate, termMonths);
  const months = Math.max(1, Math.round(options.years * 12));
  const loanRm = options.loanRate / 12;
  const investRm = options.expectedReturn / 12;
  const extra = Math.max(0, options.extraMonthly);

  let loanA = options.principal;
  let loanB = options.principal;
  let invA = 0;
  let invB = 0;

  for (let m = 0; m < months; m++) {
    invA = invA * (1 + investRm);
    invB = invB * (1 + investRm);

    // Scenario A: required + extra to loan until paid; then invest both
    const budgetA = requiredPayment + extra;
    if (loanA > 0) {
      loanA = loanA * (1 + loanRm);
      const payA = Math.min(budgetA, loanA);
      loanA = Math.max(0, loanA - payA);
      invA += budgetA - payA;
    } else {
      invA += budgetA;
    }

    // Scenario B: required to loan; extra to investments (freed required also invested once loan is gone)
    if (loanB > 0) {
      loanB = loanB * (1 + loanRm);
      const payB = Math.min(requiredPayment, loanB);
      loanB = Math.max(0, loanB - payB);
      invB += requiredPayment - payB + extra;
    } else {
      invB += requiredPayment + extra;
    }
  }

  const scenarioA: PayoffScenarioSnapshot = {
    investments: roundCents(invA),
    loanBalance: roundCents(loanA),
    netWorth: roundCents(invA - loanA),
  };
  const scenarioB: PayoffScenarioSnapshot = {
    investments: roundCents(invB),
    loanBalance: roundCents(loanB),
    netWorth: roundCents(invB - loanB),
  };

  return {
    requiredPayment: roundCents(requiredPayment),
    scenarioA,
    scenarioB,
    difference: roundCents(scenarioA.netWorth - scenarioB.netWorth),
  };
}

/** @deprecated Prefer simulatePayoffVsInvest for apples-to-apples comparisons. */
export function payoffVsInvest(options: {
  principal: number;
  loanRate: number;
  months: number;
  expectedReturn: number;
}): {
  loanPayment: number;
  totalInterest: number;
  investFutureValue: number;
  netWorthIfInvest: number;
  netWorthIfPayoff: number;
  difference: number;
} {
  const payment = loanPayment(options.principal, options.loanRate, options.months);
  const interest = totalInterestPaid(options.principal, options.loanRate, options.months);
  const investFutureValue = futureValueAnnuity(payment, options.expectedReturn / 12, options.months);
  return {
    loanPayment: payment,
    totalInterest: interest,
    investFutureValue,
    netWorthIfInvest: roundCents(investFutureValue - options.principal - interest),
    netWorthIfPayoff: 0,
    difference: roundCents(investFutureValue - options.principal - interest),
  };
}
