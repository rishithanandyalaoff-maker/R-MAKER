"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { futureValueMonthlyContributions } from "@/lib/calc/compound";
import { formatMoney } from "@/lib/format";

/** Minimal widget: monthly savings + years. Return rates are fixed public assumptions. */
export function CompoundingWidget() {
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(30);

  const data = useMemo(() => {
    const rows = [];
    for (let y = 0; y <= years; y++) {
      rows.push({
        year: y,
        savingsOnly: Math.round(futureValueMonthlyContributions(monthly, 0, y)),
        withGrowth: Math.round(futureValueMonthlyContributions(monthly, 0.07, y)),
      });
    }
    return rows;
  }, [monthly, years]);

  const end = data[data.length - 1];

  return (
    <div className="grid gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <label className="grid gap-1 text-sm">
        <span>Monthly amount you can keep ($)</span>
        <input
          type="number"
          className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
          value={monthly}
          onChange={(event) => setMonthly(Number(event.target.value))}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Years</span>
        <input
          type="range"
          min={5}
          max={40}
          value={years}
          onChange={(event) => setYears(Number(event.target.value))}
        />
        <span className="text-[var(--muted)]">{years} years</span>
      </label>
      <p className="text-sm text-[var(--muted)]">
        After {years} years: {formatMoney(end.savingsOnly)} from saving alone vs about{" "}
        {formatMoney(end.withGrowth)} with a 7% growth assumption.
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} />
            <Tooltip formatter={(v) => formatMoney(Number(v ?? 0))} />
            <Legend />
            <Line type="monotone" dataKey="savingsOnly" name="0% growth" stroke="#c45c2a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="withGrowth" name="7% growth" stroke="#0d8f7b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
