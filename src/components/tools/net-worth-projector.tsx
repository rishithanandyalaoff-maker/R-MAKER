"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PlanBasicsForm } from "@/components/plan/plan-basics-form";
import { Callout } from "@/components/callout";
import {
  projectNetWorth,
  stressTestInput,
  zeroReturnInput,
} from "@/lib/calc/projector";
import { formatMoney } from "@/lib/format";
import {
  PLAN_ASSUMPTIONS,
  PLAN_BASIC_DEFAULTS,
  buildProjectorInput,
  type PlanBasics,
} from "@/lib/plan-defaults";
import { RULES_LABEL } from "@/lib/rules/2026";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

type Mode = "base" | "stress" | "zero";

const STORAGE = `${STORAGE_KEYS.tools}:plan-basics`;

export function NetWorthProjector() {
  const [basics, setBasics] = useState<PlanBasics>(PLAN_BASIC_DEFAULTS);
  const [mode, setMode] = useState<Mode>("base");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBasics({ ...PLAN_BASIC_DEFAULTS, ...readStorage<Partial<PlanBasics>>(STORAGE, {}) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(STORAGE, basics);
  }, [basics, ready]);

  const input = useMemo(() => buildProjectorInput(basics), [basics]);
  const activeInput = useMemo(() => {
    if (mode === "stress") return stressTestInput(input);
    if (mode === "zero") return zeroReturnInput(input);
    return input;
  }, [input, mode]);

  const result = useMemo(() => projectNetWorth(activeInput), [activeInput]);

  const chartData = result.months
    .filter((_, index) => index % 3 === 0 || index === result.months.length - 1)
    .map((row) => ({
      age: Math.round(row.age * 10) / 10,
      netWorth: row.netWorth,
    }));

  function exportCsv() {
    const header = "year,month,age,netWorth,brokerage,retirement,emergency,loanBalance\n";
    const body = result.months
      .map(
        (row) =>
          `${row.year},${row.month},${row.age.toFixed(2)},${row.netWorth},${row.brokerage},${row.retirement},${row.emergency},${row.loanBalance}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "money-basics-projection.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <p className="text-sm text-[var(--muted)]">{RULES_LABEL}. Projection is educational, not advice.</p>

      <PlanBasicsForm value={basics} onChange={setBasics} />

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["base", "Base case"],
            ["stress", "Stress test"],
            ["zero", "Zero-return comparison"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={
              mode === id
                ? "rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white"
                : "rounded-full border border-[var(--line)] px-4 py-2 text-sm"
            }
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          onClick={exportCsv}
        >
          Export CSV
        </button>
      </div>

      {mode === "stress" ? (
        <Callout variant="watch">Stress test: raises 0%, bonus 0%, expected return 6%.</Callout>
      ) : null}
      {mode === "zero" ? (
        <Callout variant="watch">Zero-return comparison: same savings behavior, 0% growth.</Callout>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="At goal age" value={formatMoney(result.projectedAtGoalAge)} />
        <Stat label="On track?" value={result.onTrack ? "Yes" : "Not yet"} />
        <Stat
          label="Age goal reached"
          value={result.ageReached ? result.ageReached.toFixed(1) : "Not by horizon"}
        />
        <Stat
          label="Extra $/mo to close gap"
          value={result.onTrack ? "$0" : formatMoney(result.extraMonthlyNeeded)}
        />
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
        <h3 className="font-semibold">Net worth over time</h3>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
              />
              <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
              <Line type="monotone" dataKey="netWorth" stroke="#0d8f7b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--card)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Net worth</th>
              <th className="px-3 py-2">Brokerage</th>
              <th className="px-3 py-2">Retirement</th>
              <th className="px-3 py-2">Loan</th>
            </tr>
          </thead>
          <tbody>
            {result.yearEnd.slice(0, 12).map((row) => (
              <tr key={row.year} className="border-b border-[var(--line)]">
                <td className="px-3 py-2">{row.year}</td>
                <td className="px-3 py-2">{row.age}</td>
                <td className="px-3 py-2">{formatMoney(row.netWorth)}</td>
                <td className="px-3 py-2">{formatMoney(row.brokerage)}</td>
                <td className="px-3 py-2">{formatMoney(row.retirement)}</td>
                <td className="px-3 py-2">{formatMoney(row.loanBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout variant="example">
        <p className="font-medium">Assumptions filled for you</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {PLAN_ASSUMPTIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">{value}</p>
    </div>
  );
}
