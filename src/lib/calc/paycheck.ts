import {
  FilingStatus,
  FEDERAL_SUPPLEMENTAL_RATE,
} from "@/lib/rules/2026";
import {
  effectiveRate,
  federalIncomeTax,
  ficaTax,
  marginalFederalRate,
  roundCents,
  taxableIncomeAfterStandardDeduction,
} from "@/lib/calc/tax";

export type PaycheckInput = {
  salary: number;
  bonusPercent?: number;
  filingStatus: FilingStatus;
  traditional401k: number;
  roth401k?: number;
  healthPremiums: number;
  stateTaxRate?: number;
  optFicaExempt?: boolean;
};

export type PaycheckResult = {
  gross: number;
  traditional401k: number;
  roth401k: number;
  healthPremiums: number;
  federalTax: number;
  stateTax: number;
  fica: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  takeHomeBiweekly: number;
  taxableIncome: number;
  marginalRate: number;
  effectiveFederalRate: number;
  bonusFederalWithholding: number;
};

export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  const gross = input.salary;
  const traditional401k = Math.max(0, input.traditional401k);
  const roth401k = Math.max(0, input.roth401k ?? 0);
  const healthPremiums = Math.max(0, input.healthPremiums);
  const stateTaxRate = Math.max(0, input.stateTaxRate ?? 0);

  const federalAgi = Math.max(0, gross - traditional401k - healthPremiums);
  const taxableIncome = taxableIncomeAfterStandardDeduction(federalAgi, input.filingStatus);
  const federalTax = federalIncomeTax(taxableIncome, input.filingStatus);
  const stateTax = roundCents(federalAgi * stateTaxRate);
  // Section 125 health premiums reduce FICA wages; 401(k) contributions do not.
  const ficaWages = Math.max(0, gross - healthPremiums);
  const fica = ficaTax(ficaWages, input.filingStatus, Boolean(input.optFicaExempt));

  const takeHomeAnnual = roundCents(
    gross - traditional401k - roth401k - healthPremiums - federalTax - stateTax - fica,
  );

  const bonus = gross * Math.max(0, input.bonusPercent ?? 0);
  const bonusFederalWithholding = roundCents(bonus * FEDERAL_SUPPLEMENTAL_RATE);

  return {
    gross,
    traditional401k,
    roth401k,
    healthPremiums,
    federalTax,
    stateTax,
    fica,
    takeHomeAnnual,
    takeHomeMonthly: roundCents(takeHomeAnnual / 12),
    takeHomeBiweekly: roundCents(takeHomeAnnual / 26),
    taxableIncome,
    marginalRate: marginalFederalRate(taxableIncome, input.filingStatus),
    effectiveFederalRate: effectiveRate(federalTax, gross),
    bonusFederalWithholding,
  };
}
