"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projectNetWorth } from "@/lib/calc/projector";
import { formatMoney } from "@/lib/format";
import {
  PLAN_ASSUMPTIONS,
  PLAN_BASIC_DEFAULTS,
  buildProjectorInput,
  structureSummary,
  type PlanBasics,
} from "@/lib/plan-defaults";
import { RULES_LABEL } from "@/lib/rules/2026";
import { STORAGE_KEYS, readStorage } from "@/lib/storage";

const STORAGE = `${STORAGE_KEYS.tools}:plan-basics`;

export function PrintablePlan() {
  const [basics, setBasics] = useState<PlanBasics>(PLAN_BASIC_DEFAULTS);

  useEffect(() => {
    setBasics({ ...PLAN_BASIC_DEFAULTS, ...readStorage<Partial<PlanBasics>>(STORAGE, {}) });
  }, []);

  const result = useMemo(() => projectNetWorth(buildProjectorInput(basics)), [basics]);
  const steps = structureSummary(basics);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white"
          onClick={() => window.print()}
        >
          Print
        </button>
        <Link href="/plan/" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          Back to plan builder
        </Link>
      </div>

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 print:border-0 print:p-0">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Money Basics · My Plan</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
          {formatMoney(basics.goalAmount)} by age {basics.goalAge}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Age {basics.age} · Salary {formatMoney(basics.salary)} ·{" "}
          {basics.shortHorizon ? "Short / flexible US horizon" : "Long-horizon path"}
          {basics.onOptOrF1 ? " · F-1/OPT" : ""}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{RULES_LABEL}</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Funding order</h2>
          <ol className="mt-3 grid gap-2">
            {steps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">Projected at goal age</p>
            <p className="text-2xl font-semibold">{formatMoney(result.projectedAtGoalAge)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">On track</p>
            <p className="text-2xl font-semibold">{result.onTrack ? "Yes" : "Not yet"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-[var(--muted)]">Extra $/mo if behind</p>
            <p className="text-2xl font-semibold">
              {result.onTrack ? "$0" : formatMoney(result.extraMonthlyNeeded)}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Year-end checkpoints</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                <th className="py-2">Year</th>
                <th className="py-2">Age</th>
                <th className="py-2">Target path (modeled)</th>
                <th className="py-2">Actual (fill in)</th>
              </tr>
            </thead>
            <tbody>
              {result.yearEnd.slice(0, 8).map((row) => (
                <tr key={row.year} className="border-b border-[var(--line)]">
                  <td className="py-2">{row.year}</td>
                  <td className="py-2">{row.age}</td>
                  <td className="py-2">{formatMoney(row.netWorth)}</td>
                  <td className="py-2">___________</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Protection checklist</h2>
          <ul className="mt-3 grid gap-1 text-sm">
            <li>☐ Beneficiaries named on every account</li>
            <li>☐ Renters / apartment insurance if needed</li>
            <li>☐ Disability coverage reviewed with HR</li>
            <li>☐ Will / healthcare proxy when life gets more complex</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Assumptions</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            {PLAN_ASSUMPTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-xs text-[var(--muted)]">
          Educational only — not financial, tax, legal, or immigration advice. Confirm details with IRS.gov, HR, your
          school’s international office, or a licensed professional.
        </p>
      </article>
    </div>
  );
}
