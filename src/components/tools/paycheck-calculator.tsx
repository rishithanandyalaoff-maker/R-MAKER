"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculatePaycheck } from "@/lib/calc/paycheck";
import {
  ASSUMPTION_NOTES,
  defaultFilingStatus,
  defaultHealthPremiums,
  defaultOptFicaExempt,
  defaultStateTaxRate,
  defaultTraditional401k,
} from "@/lib/defaults";
import { EMPLOYEE_401K_LIMIT, RULES_LABEL } from "@/lib/rules/2026";
import { formatMoney, formatPercent } from "@/lib/format";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";
import { Callout } from "@/components/callout";

type FormState = {
  salary: number;
  onOptOrF1: boolean;
  showAdvanced: boolean;
  filingStatus: "single" | "marriedJoint";
  traditional401k: number;
  roth401k: number;
  healthPremiums: number;
  stateTaxRate: number;
  bonusPercent: number;
};

const STORAGE = `${STORAGE_KEYS.tools}:paycheck-v2`;

function buildDefaults(salary = 150_000, onOptOrF1 = false): FormState {
  const hints = { international: onOptOrF1, onOptOrF1, salary };
  return {
    salary,
    onOptOrF1,
    showAdvanced: false,
    filingStatus: defaultFilingStatus(),
    traditional401k: defaultTraditional401k(salary, hints),
    roth401k: 0,
    healthPremiums: defaultHealthPremiums(),
    stateTaxRate: defaultStateTaxRate(hints),
    bonusPercent: 0,
  };
}

export function PaycheckCalculator() {
  const [form, setForm] = useState<FormState>(buildDefaults());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readStorage<Partial<FormState>>(STORAGE, {});
    const base = buildDefaults(saved.salary ?? 150_000, Boolean(saved.onOptOrF1));
    setForm({
      ...base,
      ...saved,
      // Keep public-rule defaults unless the user already customized advanced fields.
      traditional401k: saved.traditional401k ?? base.traditional401k,
      healthPremiums: saved.healthPremiums ?? base.healthPremiums,
      stateTaxRate: saved.stateTaxRate ?? base.stateTaxRate,
      filingStatus: saved.filingStatus ?? base.filingStatus,
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(STORAGE, form);
  }, [form, ready]);

  const result = useMemo(
    () =>
      calculatePaycheck({
        salary: form.salary,
        bonusPercent: form.bonusPercent,
        filingStatus: form.filingStatus,
        traditional401k: form.traditional401k,
        roth401k: form.roth401k,
        healthPremiums: form.healthPremiums,
        stateTaxRate: form.stateTaxRate,
        optFicaExempt: defaultOptFicaExempt({
          international: form.onOptOrF1,
          onOptOrF1: form.onOptOrF1,
        }),
      }),
    [form],
  );

  const chartData = [
    { name: "Take-home", value: result.takeHomeAnnual, color: "#0d8f7b" },
    { name: "Federal tax", value: result.federalTax, color: "#c45c2a" },
    { name: "FICA", value: result.fica, color: "#1f6f8f" },
    { name: "State tax", value: result.stateTax, color: "#2a6bb5" },
    {
      name: "401(k)+health",
      value: result.traditional401k + result.roth401k + result.healthPremiums,
      color: "#5a6b7d",
    },
  ].filter((row) => row.value > 0);

  function setSalary(salary: number) {
    setForm((prev) => {
      const prevHints = { international: prev.onOptOrF1, onOptOrF1: prev.onOptOrF1, salary: prev.salary };
      const nextHints = { international: prev.onOptOrF1, onOptOrF1: prev.onOptOrF1, salary };
      const wasDefault = prev.traditional401k === defaultTraditional401k(prev.salary, prevHints);
      return {
        ...prev,
        salary,
        traditional401k: wasDefault
          ? defaultTraditional401k(salary, nextHints)
          : Math.min(prev.traditional401k, EMPLOYEE_401K_LIMIT),
      };
    });
  }

  function setOpt(onOptOrF1: boolean) {
    setForm((prev) => ({ ...prev, onOptOrF1 }));
  }

  return (
    <div className="grid gap-6">
      <p className="text-sm text-[var(--muted)]">
        {RULES_LABEL}. Only salary is required. Everything else is filled from public IRS limits and simple defaults.
      </p>

      <div className="grid gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
        <NumberField label="Annual salary ($)" value={form.salary} onChange={setSalary} />
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.onOptOrF1}
            onChange={(event) => setOpt(event.target.checked)}
          />
          <span>
            I am on F-1 / OPT (nonresident student worker)
            <span className="block text-[var(--muted)]">{ASSUMPTION_NOTES.fica}</span>
          </span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Monthly take-home" value={formatMoney(result.takeHomeMonthly)} />
        <Stat label="Biweekly take-home" value={formatMoney(result.takeHomeBiweekly)} />
        <Stat label="Annual take-home" value={formatMoney(result.takeHomeAnnual)} />
        <Stat label="Effective federal rate" value={formatPercent(result.effectiveFederalRate)} />
        <Stat label="Marginal federal rate" value={formatPercent(result.marginalRate)} />
        <Stat label="FICA this year" value={formatMoney(result.fica)} />
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
        <h3 className="font-semibold text-[var(--ink)]">Where each salary dollar goes</h3>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Callout variant="example">
        <p className="font-medium">Assumptions we filled in for you</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{ASSUMPTION_NOTES.traditional401k}</li>
          <li>{ASSUMPTION_NOTES.health}</li>
          <li>{ASSUMPTION_NOTES.state}</li>
          <li>Filing status defaults to single.</li>
        </ul>
      </Callout>

      <button
        type="button"
        className="justify-self-start rounded-full border border-[var(--line)] px-4 py-2 text-sm"
        onClick={() => setForm((prev) => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
      >
        {form.showAdvanced ? "Hide optional details" : "Adjust optional details"}
      </button>

      {form.showAdvanced ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Filing status</span>
            <select
              className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2"
              value={form.filingStatus}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  filingStatus: event.target.value as FormState["filingStatus"],
                }))
              }
            >
              <option value="single">Single</option>
              <option value="marriedJoint">Married filing jointly</option>
            </select>
          </label>
          <NumberField
            label={`Traditional 401(k) ($/yr, max ${formatMoney(EMPLOYEE_401K_LIMIT)})`}
            value={form.traditional401k}
            onChange={(traditional401k) => setForm((prev) => ({ ...prev, traditional401k }))}
          />
          <NumberField
            label="Roth 401(k) ($/yr)"
            value={form.roth401k}
            onChange={(roth401k) => setForm((prev) => ({ ...prev, roth401k }))}
          />
          <NumberField
            label="Health premiums ($/yr)"
            value={form.healthPremiums}
            onChange={(healthPremiums) => setForm((prev) => ({ ...prev, healthPremiums }))}
          />
          <NumberField
            label="State tax rate (%)"
            value={form.stateTaxRate * 100}
            onChange={(n) => setForm((prev) => ({ ...prev, stateTaxRate: n / 100 }))}
            step={0.1}
          />
          <NumberField
            label="Bonus (% of salary)"
            value={form.bonusPercent * 100}
            onChange={(n) => setForm((prev) => ({ ...prev, bonusPercent: n / 100 }))}
            step={1}
          />
        </div>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-[var(--ink)]">{label}</span>
      <input
        type="number"
        step={step}
        className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
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
