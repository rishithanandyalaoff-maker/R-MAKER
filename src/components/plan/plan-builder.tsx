"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlanBasicsForm } from "@/components/plan/plan-basics-form";
import { Callout } from "@/components/callout";
import { projectNetWorth } from "@/lib/calc/projector";
import { formatMoney } from "@/lib/format";
import {
  PLAN_ASSUMPTIONS,
  PLAN_BASIC_DEFAULTS,
  buildProjectorInput,
  structureSummary,
  type PlanBasics,
} from "@/lib/plan-defaults";
import { EMPLOYEE_401K_LIMIT, IRA_LIMIT, RULES_LABEL } from "@/lib/rules/2026";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

const STORAGE = `${STORAGE_KEYS.tools}:plan-basics`;

const HR_CHECKLIST = [
  "Is retirement money a match or an automatic contribution?",
  "What is the vesting schedule?",
  "Must I be employed on the contribution payment date?",
  "Is Roth 401(k) available?",
  "Is there a mega backdoor Roth (after-tax 401(k) + conversion)?",
  "Is an HSA available with my health plan?",
  "What disability / life coverage is included?",
  "What is the personal trading / brokerage policy?",
];

const JANUARY_CHECKLIST = [
  "Update salary, bonus, and living costs",
  "Confirm 401(k) and IRA elections for the new year",
  "Revisit stay-in-US horizon and emergency fund size",
  "Check loan rates vs refinance options",
  "Rebalance simple index mix if needed",
];

export function PlanBuilder() {
  const [basics, setBasics] = useState<PlanBasics>(PLAN_BASIC_DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBasics({ ...PLAN_BASIC_DEFAULTS, ...readStorage<Partial<PlanBasics>>(STORAGE, {}) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(STORAGE, basics);
  }, [basics, ready]);

  const result = useMemo(() => projectNetWorth(buildProjectorInput(basics)), [basics]);
  const steps = structureSummary(basics);

  return (
    <div className="grid gap-8">
      <PlanBasicsForm value={basics} onChange={setBasics} />

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{RULES_LABEL}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Your structure</h2>
        <p className="mt-2 text-[var(--muted)]">
          Goal: {formatMoney(basics.goalAmount)} by age {basics.goalAge}. Path:{" "}
          {basics.shortHorizon ? "flexible / shorter US horizon" : "long-horizon growth"}.
        </p>
        <ol className="mt-4 grid gap-2">
          {steps.map((step, index) => (
            <li key={step} className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm">
              <span className="font-semibold">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Projected at goal age" value={formatMoney(result.projectedAtGoalAge)} />
        <Stat label="On track?" value={result.onTrack ? "Yes" : "Not yet"} />
        <Stat
          label="Extra monthly if behind"
          value={result.onTrack ? "$0" : formatMoney(result.extraMonthlyNeeded)}
        />
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Account strategy snapshot</h2>
        <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
          <li>
            401(k) employee room this year: up to {formatMoney(EMPLOYEE_401K_LIMIT)}
            {basics.shortHorizon ? " — model keeps extra deferrals light on a short horizon." : " — long-horizon default funds toward the limit."}
          </li>
          <li>IRA / Roth IRA room this year: up to {formatMoney(IRA_LIMIT)}.</li>
          <li>
            Emergency fund default: {basics.onOptOrF1 ? "6" : "3"} months of estimated living costs
            ({formatMoney(Math.round((basics.salary * 0.25) / 12) * (basics.onOptOrF1 ? 6 : 3))}).
          </li>
          <li>
            Student loans modeled:{" "}
            {basics.hasStudentLoans ? formatMoney(basics.loanBalance) + " at a 7% placeholder rate until refinance assumptions kick in." : "none."}
          </li>
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Checklist title="Ask HR at onboarding" items={HR_CHECKLIST} />
        <Checklist title="Every January" items={JANUARY_CHECKLIST} />
      </section>

      <Callout variant="example">
        <p className="font-medium">Filled-in assumptions</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {PLAN_ASSUMPTIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Link href="/plan/print/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white">
          Open printable My Plan
        </Link>
        <Link href="/tools/projector/" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          Open full projector
        </Link>
      </div>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
      <h2 className="font-[family-name:var(--font-display)] text-2xl">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[var(--muted)]">
            <span aria-hidden="true">☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">{value}</p>
    </div>
  );
}
