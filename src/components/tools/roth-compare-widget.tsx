"use client";

import { traditionalVsRoth } from "@/lib/calc/compound";
import { formatMoney } from "@/lib/format";

/** No inputs — uses the public worked example from the curriculum. */
export function RothCompareWidget() {
  const result = traditionalVsRoth({
    salaryDollars: 1_000,
    taxNow: 0.24,
    taxLater: 0.24,
    annualReturn: 0.07,
    years: 30,
  });

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm">
      <p>
        On $1,000 of salary, 24% tax now and later, 7% for 30 years:
      </p>
      <ul className="mt-3 grid gap-1">
        <li>Traditional after tax later: {formatMoney(result.traditionalAfterTax)}</li>
        <li>Roth after tax later: {formatMoney(result.rothAfterTax)}</li>
      </ul>
      <p className="mt-3 text-[var(--muted)]">
        When rates match, results match. Choose Roth when today&apos;s tax rate is lower than you expect in retirement
        (for example, a partial first year of work); traditional when today&apos;s rate is higher.
      </p>
    </div>
  );
}
