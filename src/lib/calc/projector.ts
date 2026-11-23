import { FilingStatus } from "@/lib/rules/2026";
import { calculatePaycheck } from "@/lib/calc/paycheck";
import { loanPayment } from "@/lib/calc/loan";
import { roundCents } from "@/lib/calc/tax";

const round = (n: number) => roundCents(n);

export type ProjectorInput = {
  birthYear: number;
  birthMonth: number;
  jobStartYear: number;
  jobStartMonth: number;
  goalAmount: number;
  goalAge: number;
  salary: number;
  raisePercent: number;
  firstRaiseYear: number;
  bonusPercent: number;
  firstBonusYear: number;
  employerContributionPercent: number;
  filingStatus: FilingStatus;
  stateTaxRate: number;
  optFicaExempt: boolean;
  h1bStartYear: number;
  h1bStartMonth: number;
  trad401kStartYear: number;
  roth401kPercentBefore: number;
  trad401kAnnual: number;
  rothIraAnnual: number;
  healthPremiums: number;
  livingMonthly: number;
  livingInflation: number;
  emergencyTarget: number;
  emergencyMonthly: number;
  hysaRate: number;
  loanBalance: number;
  loanRateBefore: number;
  loanPaymentBefore: number;
  refinanceYear: number;
  refinanceMonth: number;
  refinanceRate: number;
  refinanceYears: number;
  extraLoanPayment: number;
  expectedReturn: number;
  startBrokerage: number;
  startRetirement: number;
  startEmergency: number;
};

export type MonthRow = {
  year: number;
  month: number;
  age: number;
  salary: number;
  netWorth: number;
  brokerage: number;
  retirement: number;
  emergency: number;
  loanBalance: number;
  living: number;
};

export type ProjectorResult = {
  months: MonthRow[];
  projectedAtGoalAge: number;
  onTrack: boolean;
  ageReached: number | null;
  extraMonthlyNeeded: number;
  monthsToGoal: number;
  yearEnd: Array<{
    year: number;
    age: number;
    netWorth: number;
    brokerage: number;
    retirement: number;
    loanBalance: number;
    living: number;
  }>;
};

function ageMonthsAt(year: number, month: number, birthYear: number, birthMonth: number): number {
  return (year - birthYear) * 12 + (month - birthMonth);
}

export function projectNetWorth(input: ProjectorInput): ProjectorResult {
  const months: MonthRow[] = [];
  let brokerage = input.startBrokerage;
  let retirement = input.startRetirement;
  let emergency = input.startEmergency;
  let loan = Math.max(0, input.loanBalance);
  let living = input.livingMonthly;

  const startAgeMonths = ageMonthsAt(
    input.jobStartYear,
    input.jobStartMonth,
    input.birthYear,
    input.birthMonth,
  );
  const goalAgeMonths = Math.round(input.goalAge * 12);
  const monthsToGoal = Math.max(1, goalAgeMonths - startAgeMonths);
  const horizonMonths = monthsToGoal + 12;

  let ageReached: number | null = null;
  let projectedAtGoalAge = 0;

  for (let i = 0; i < horizonMonths; i++) {
    const date = new Date(input.jobStartYear, input.jobStartMonth - 1 + i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const ageMonths = ageMonthsAt(year, month, input.birthYear, input.birthMonth);
    const age = ageMonths / 12;

    if (month === 1 && i > 0) living = round(living * (1 + input.livingInflation));

    const yearsRaised = year >= input.firstRaiseYear ? year - input.firstRaiseYear + 1 : 0;
    const salary =
      yearsRaised <= 0 ? input.salary : round(input.salary * Math.pow(1 + input.raisePercent, yearsRaised));

    const useTrad = year >= input.trad401kStartYear;
    const trad401k = useTrad ? input.trad401kAnnual : 0;
    const roth401k = useTrad ? 0 : round(salary * input.roth401kPercentBefore);

    const ficaExempt =
      input.optFicaExempt &&
      (year < input.h1bStartYear || (year === input.h1bStartYear && month < input.h1bStartMonth));

    const paycheck = calculatePaycheck({
      salary,
      filingStatus: input.filingStatus,
      traditional401k: trad401k,
      roth401k,
      healthPremiums: input.healthPremiums,
      stateTaxRate: input.stateTaxRate,
      optFicaExempt: ficaExempt,
    });

    let cash = paycheck.takeHomeMonthly;

    if (month === 12 && year >= input.firstBonusYear && input.bonusPercent > 0) {
      const bonus = salary * input.bonusPercent;
      cash = round(cash + bonus * 0.6);
    }

    const employer = round((salary * input.employerContributionPercent) / 12);
    const employeeDeferral = round((trad401k + roth401k) / 12);
    retirement = round(retirement * (1 + input.expectedReturn / 12) + employeeDeferral + employer);

    const refinanced =
      year > input.refinanceYear || (year === input.refinanceYear && month >= input.refinanceMonth);
    const rate = refinanced ? input.refinanceRate : input.loanRateBefore;
    const scheduled =
      (refinanced
        ? loanPayment(Math.max(loan, 0) || input.loanBalance, input.refinanceRate, input.refinanceYears * 12)
        : input.loanPaymentBefore) + input.extraLoanPayment;

    if (loan > 0 && scheduled > 0) {
      const interest = round(loan * (rate / 12));
      const principal = Math.min(loan, Math.max(0, scheduled - interest));
      const paid = interest + principal;
      loan = round(Math.max(0, loan - principal));
      cash = round(cash - paid);
    }

    let toEmergency = 0;
    if (emergency < input.emergencyTarget) {
      toEmergency = Math.min(input.emergencyMonthly, Math.max(0, input.emergencyTarget - emergency), Math.max(0, cash));
      cash = round(cash - toEmergency);
      emergency = round(emergency * (1 + input.hysaRate / 12) + toEmergency);
    } else {
      emergency = round(emergency * (1 + input.hysaRate / 12));
    }

    const rothIra = Math.min(round(input.rothIraAnnual / 12), Math.max(0, cash));
    cash = round(cash - rothIra);
    retirement = round(retirement + rothIra);

    const livingPaid = Math.min(living, Math.max(0, cash));
    cash = round(cash - livingPaid);
    const toBrokerage = Math.max(0, cash);
    brokerage = round(brokerage * (1 + input.expectedReturn / 12) + toBrokerage);

    const netWorth = round(brokerage + retirement + emergency - loan);
    months.push({
      year,
      month,
      age,
      salary,
      netWorth,
      brokerage,
      retirement,
      emergency,
      loanBalance: loan,
      living,
    });

    if (ageReached === null && netWorth >= input.goalAmount) ageReached = age;
    if (i === monthsToGoal - 1) projectedAtGoalAge = netWorth;
  }

  if (!projectedAtGoalAge && months.length) {
    const closest = months.reduce((best, row) =>
      Math.abs(row.age - input.goalAge) < Math.abs(best.age - input.goalAge) ? row : best,
    );
    projectedAtGoalAge = closest.netWorth;
  }

  const onTrack = projectedAtGoalAge >= input.goalAmount;
  const gap = Math.max(0, input.goalAmount - projectedAtGoalAge);
  const r = input.expectedReturn / 12;
  const extraMonthlyNeeded = onTrack
    ? 0
    : r === 0
      ? round(gap / monthsToGoal)
      : round(gap / ((Math.pow(1 + r, monthsToGoal) - 1) / r));

  const yearEndMap = new Map<number, MonthRow>();
  for (const row of months) {
    if (row.month === 12) yearEndMap.set(row.year, row);
  }

  return {
    months,
    projectedAtGoalAge,
    onTrack,
    ageReached,
    extraMonthlyNeeded,
    monthsToGoal,
    yearEnd: [...yearEndMap.values()].map((row) => ({
      year: row.year,
      age: Math.round(row.age * 10) / 10,
      netWorth: row.netWorth,
      brokerage: row.brokerage,
      retirement: row.retirement,
      loanBalance: row.loanBalance,
      living: row.living,
    })),
  };
}

export function stressTestInput(input: ProjectorInput): ProjectorInput {
  return {
    ...input,
    raisePercent: 0,
    bonusPercent: 0,
    expectedReturn: 0.06,
  };
}

export function zeroReturnInput(input: ProjectorInput): ProjectorInput {
  return {
    ...input,
    expectedReturn: 0,
    hysaRate: 0,
  };
}
