import { describe, expect, it } from "vitest";
import { calculatePaycheck } from "@/lib/calc/paycheck";
import { loanPayment, simulatePayoffVsInvest, totalInterestPaid } from "@/lib/calc/loan";
import {
  futureValueLumpSum,
  futureValueMonthlyContributions,
  traditionalVsRoth,
} from "@/lib/calc/compound";
import { projectNetWorth } from "@/lib/calc/projector";

describe("paycheck calculator", () => {
  it("$200k single, traditional 401k $24,500, health $3,000, FICA on", () => {
    const result = calculatePaycheck({
      salary: 200_000,
      filingStatus: "single",
      traditional401k: 24_500,
      healthPremiums: 3_000,
      stateTaxRate: 0,
      optFicaExempt: false,
    });
    expect(result.federalTax).toBe(30_134);
    // FICA on $197,000 (salary − health): SS wage base + Medicare
    expect(result.fica).toBe(14_295.5);
    expect(result.takeHomeMonthly).toBeCloseTo(10_673, 0);
  });

  it("$150k single, $24,500 401k, $3,000 health", () => {
    const result = calculatePaycheck({
      salary: 150_000,
      filingStatus: "single",
      traditional401k: 24_500,
      healthPremiums: 3_000,
      stateTaxRate: 0,
      optFicaExempt: false,
    });
    expect(result.federalTax).toBe(18_134);
    expect(result.fica).toBe(11_245.5);
    expect(result.takeHomeMonthly).toBeCloseTo(7_760, 0);
  });

  it("$150k single, $0 401k, $3,000 health", () => {
    const result = calculatePaycheck({
      salary: 150_000,
      filingStatus: "single",
      traditional401k: 0,
      healthPremiums: 3_000,
      stateTaxRate: 0,
      optFicaExempt: false,
    });
    expect(result.federalTax).toBe(24_014);
    expect(result.fica).toBe(11_245.5);
    expect(Math.round(result.takeHomeAnnual)).toBe(111_741);
  });

  it("OPT FICA exemption raises take-home by annual FICA", () => {
    const base = calculatePaycheck({
      salary: 200_000,
      filingStatus: "single",
      traditional401k: 24_500,
      healthPremiums: 3_000,
      optFicaExempt: false,
    });
    const exempt = calculatePaycheck({
      salary: 200_000,
      filingStatus: "single",
      traditional401k: 24_500,
      healthPremiums: 3_000,
      optFicaExempt: true,
    });
    expect(exempt.takeHomeAnnual - base.takeHomeAnnual).toBe(14_295.5);
  });
});

describe("loan math", () => {
  it("$100k over 36 months at 10%", () => {
    expect(loanPayment(100_000, 0.1, 36)).toBeCloseTo(3_226.72, 2);
    expect(totalInterestPaid(100_000, 0.1, 36)).toBeCloseTo(16_162, 0);
  });

  it("$100k over 36 months at 5%", () => {
    expect(loanPayment(100_000, 0.05, 36)).toBeCloseTo(2_997.09, 2);
    expect(totalInterestPaid(100_000, 0.05, 36)).toBeCloseTo(7_895, 0);
  });
});

describe("compounding", () => {
  it("$1,000 at 7% for 30 years", () => {
    expect(futureValueLumpSum(1_000, 0.07, 30)).toBeCloseTo(7_612, 0);
  });

  it("$1,000/month at 7% for 30 years (monthly compounding)", () => {
    expect(futureValueMonthlyContributions(1_000, 0.07, 30)).toBeCloseTo(1_169_453, 0);
  });

  it("$1,000/month at 0% for 30 years", () => {
    expect(futureValueMonthlyContributions(1_000, 0, 30)).toBe(360_000);
  });

  it("traditional vs Roth identical when tax rates match", () => {
    const result = traditionalVsRoth({
      salaryDollars: 1_000,
      taxNow: 0.24,
      taxLater: 0.24,
      annualReturn: 0.07,
      years: 30,
    });
    expect(result.traditionalAfterTax).toBeCloseTo(5_785, 0);
    expect(result.rothAfterTax).toBeCloseTo(5_785, 0);
  });
});

describe("payoff vs invest simulation", () => {
  it("$50k at 7%, required ~$990.06, extra $500, return 7%, 5 years → A ≈ B", () => {
    const required = loanPayment(50_000, 0.07, 60);
    expect(required).toBeCloseTo(990.06, 2);
    const result = simulatePayoffVsInvest({
      principal: 50_000,
      loanRate: 0.07,
      requiredPayment: required,
      extraMonthly: 500,
      expectedReturn: 0.07,
      years: 5,
    });
    const denom = Math.max(Math.abs(result.scenarioA.netWorth), Math.abs(result.scenarioB.netWorth), 1);
    expect(Math.abs(result.scenarioA.netWorth - result.scenarioB.netWorth) / denom).toBeLessThan(0.01);
  });
});

describe("projector invariants", () => {
  it("extra monthly needed is 0 when on track at 0% return with huge starting balance", () => {
    const result = projectNetWorth({
      birthYear: 1998,
      birthMonth: 1,
      jobStartYear: 2027,
      jobStartMonth: 8,
      goalAmount: 10_000,
      goalAge: 30,
      salary: 200_000,
      raisePercent: 0,
      firstRaiseYear: 2029,
      bonusPercent: 0,
      firstBonusYear: 2028,
      employerContributionPercent: 0.05,
      filingStatus: "single",
      stateTaxRate: 0,
      optFicaExempt: true,
      h1bStartYear: 2027,
      h1bStartMonth: 10,
      trad401kStartYear: 2028,
      roth401kPercentBefore: 0.2,
      trad401kAnnual: 24_500,
      rothIraAnnual: 7_500,
      healthPremiums: 3_000,
      livingMonthly: 3_000,
      livingInflation: 0,
      emergencyTarget: 0,
      emergencyMonthly: 0,
      hysaRate: 0,
      loanBalance: 0,
      loanRateBefore: 0,
      loanPaymentBefore: 0,
      refinanceYear: 2027,
      refinanceMonth: 11,
      refinanceRate: 0.05,
      refinanceYears: 10,
      extraLoanPayment: 0,
      expectedReturn: 0,
      startBrokerage: 50_000,
      startRetirement: 0,
      startEmergency: 0,
    });
    expect(result.onTrack).toBe(true);
    expect(result.extraMonthlyNeeded).toBe(0);
  });

  it("with 0% return, projected net worth is finite and extra monthly is 0 when already above goal", () => {
    const result = projectNetWorth({
      birthYear: 2000,
      birthMonth: 1,
      jobStartYear: 2026,
      jobStartMonth: 1,
      goalAmount: 1_000,
      goalAge: 27,
      salary: 80_000,
      raisePercent: 0,
      firstRaiseYear: 2030,
      bonusPercent: 0,
      firstBonusYear: 2030,
      employerContributionPercent: 0,
      filingStatus: "single",
      stateTaxRate: 0,
      optFicaExempt: false,
      h1bStartYear: 2030,
      h1bStartMonth: 10,
      trad401kStartYear: 2026,
      roth401kPercentBefore: 0,
      trad401kAnnual: 0,
      rothIraAnnual: 0,
      healthPremiums: 0,
      livingMonthly: 2_000,
      livingInflation: 0,
      emergencyTarget: 0,
      emergencyMonthly: 0,
      hysaRate: 0,
      loanBalance: 0,
      loanRateBefore: 0,
      loanPaymentBefore: 0,
      refinanceYear: 2030,
      refinanceMonth: 1,
      refinanceRate: 0.05,
      refinanceYears: 10,
      extraLoanPayment: 0,
      expectedReturn: 0,
      startBrokerage: 5_000,
      startRetirement: 0,
      startEmergency: 0,
    });
    expect(Number.isFinite(result.projectedAtGoalAge)).toBe(true);
    expect(result.extraMonthlyNeeded).toBe(0);
  });
});
