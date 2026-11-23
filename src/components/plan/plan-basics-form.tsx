"use client";

import { PLAN_BASIC_DEFAULTS, type PlanBasics } from "@/lib/plan-defaults";

export function PlanBasicsForm({
  value,
  onChange,
}: {
  value: PlanBasics;
  onChange: (next: PlanBasics) => void;
}) {
  return (
    <div className="grid gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
      <p className="text-sm text-[var(--muted)]">
        Only these basics are required. Tax limits, returns, raises, and living-cost estimates are filled from public rules
        and plain defaults.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Your age"
          value={value.age}
          onChange={(age) => onChange({ ...value, age })}
        />
        <NumberField
          label="Annual salary ($)"
          value={value.salary}
          onChange={(salary) => onChange({ ...value, salary })}
        />
        <NumberField
          label="Goal net worth ($)"
          value={value.goalAmount}
          onChange={(goalAmount) => onChange({ ...value, goalAmount })}
        />
        <NumberField
          label="Goal age"
          value={value.goalAge}
          onChange={(goalAge) => onChange({ ...value, goalAge })}
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={value.onOptOrF1}
          onChange={(event) => onChange({ ...value, onOptOrF1: event.target.checked })}
        />
        <span>F-1 / OPT now (affects FICA + emergency-fund default)</span>
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={value.shortHorizon}
          onChange={(event) => onChange({ ...value, shortHorizon: event.target.checked })}
        />
        <span>I may leave the US within ~5 years (keeps more money flexible)</span>
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={value.hasStudentLoans}
          onChange={(event) =>
            onChange({
              ...value,
              hasStudentLoans: event.target.checked,
              loanBalance: event.target.checked ? value.loanBalance || 50_000 : 0,
            })
          }
        />
        <span>I have student loans</span>
      </label>

      {value.hasStudentLoans ? (
        <NumberField
          label="Approx. loan balance ($)"
          value={value.loanBalance}
          onChange={(loanBalance) => onChange({ ...value, loanBalance })}
        />
      ) : null}

      <button
        type="button"
        className="justify-self-start text-sm text-[var(--muted)] underline-offset-2 hover:underline"
        onClick={() => onChange({ ...PLAN_BASIC_DEFAULTS })}
      >
        Reset to starter defaults
      </button>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-[var(--ink)]">{label}</span>
      <input
        type="number"
        className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
