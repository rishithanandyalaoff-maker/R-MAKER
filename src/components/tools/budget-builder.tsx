"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { calculatePaycheck } from "@/lib/calc/paycheck";
import { formatMoney, formatPercent } from "@/lib/format";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

type Cats = {
  rent: number;
  food: number;
  transport: number;
  fun: number;
  other: number;
};

const DEFAULT_CATS: Cats = { rent: 1500, food: 500, transport: 200, fun: 300, other: 200 };
const COLORS = ["#0d8f7b", "#1f6f8f", "#2a6bb5", "#c45c2a", "#5a6b7d"];

export function BudgetBuilder() {
  const [salary, setSalary] = useState(150_000);
  const [cats, setCats] = useState<Cats>(DEFAULT_CATS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readStorage<{ salary?: number; cats?: Cats }>(`${STORAGE_KEYS.tools}:budget`, {});
    if (saved.salary) setSalary(saved.salary);
    if (saved.cats) setCats({ ...DEFAULT_CATS, ...saved.cats });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(`${STORAGE_KEYS.tools}:budget`, { salary, cats });
  }, [salary, cats, ready]);

  const takeHome = useMemo(
    () =>
      calculatePaycheck({
        salary,
        filingStatus: "single",
        traditional401k: 0,
        healthPremiums: 3000,
        stateTaxRate: 0,
      }).takeHomeMonthly,
    [salary],
  );

  const living = Object.values(cats).reduce((sum, n) => sum + n, 0);
  const leftover = takeHome - living;
  const shareOfTakeHome = takeHome > 0 ? living / takeHome : 0;
  const chart = Object.entries(cats).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--muted)]">
        Enter salary. Take-home is estimated with public tax rules. Fill only the spending lines you care about.
      </p>
      <label className="grid gap-1 text-sm">
        <span>Annual salary ($)</span>
        <input
          type="number"
          className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2"
          value={salary}
          onChange={(event) => setSalary(Number(event.target.value))}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["rent", "Rent / housing"],
            ["food", "Food"],
            ["transport", "Transport"],
            ["fun", "Fun / travel"],
            ["other", "Other"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="grid gap-1 text-sm">
            <span>{label} ($/mo)</span>
            <input
              type="number"
              className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2"
              value={cats[key]}
              onChange={(event) => setCats((prev) => ({ ...prev, [key]: Number(event.target.value) }))}
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Est. take-home" value={formatMoney(takeHome)} />
        <Stat label="Living total" value={formatMoney(living)} />
        <Stat label="Left for saving/debt" value={formatMoney(leftover)} />
      </div>
      {shareOfTakeHome > 0.5 ? (
        <p className="rounded-xl bg-[var(--amber-soft)] px-3 py-2 text-sm">
          Living costs are {formatPercent(shareOfTakeHome)} of take-home (above a simple 50% watch line).
        </p>
      ) : null}
      <div className="h-64 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chart} dataKey="value" nameKey="name" outerRadius={90}>
              {chart.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatMoney(Number(v ?? 0))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
