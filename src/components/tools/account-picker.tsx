"use client";

import { useMemo, useState } from "react";

type Answers = {
  matchAvailable: boolean;
  highInterestDebt: boolean;
  emergencyReady: boolean;
  shortHorizon: boolean;
};

export function AccountPicker() {
  const [answers, setAnswers] = useState<Answers>({
    matchAvailable: true,
    highInterestDebt: false,
    emergencyReady: false,
    shortHorizon: false,
  });

  const next = useMemo(() => {
    if (answers.matchAvailable) {
      return {
        title: "Get the full employer match (or confirm automatic contribution)",
        detail: "This is usually the highest-return first dollar if the money is free.",
      };
    }
    if (answers.highInterestDebt) {
      return {
        title: "Pay high-interest debt next",
        detail: "Rates roughly above 7–8% usually beat investing.",
      };
    }
    if (!answers.emergencyReady) {
      return {
        title: "Build the emergency fund in HYSA",
        detail: answers.shortHorizon
          ? "Aim for ~6 months if your job/visa is uncertain."
          : "Aim for 3–6 months of expenses.",
      };
    }
    if (answers.shortHorizon) {
      return {
        title: "Fund flexible brokerage (and Roth IRA carefully)",
        detail: "Keep most new investing accessible if you may leave the US within ~5 years.",
      };
    }
    return {
      title: "Roth IRA, then 401(k), then brokerage",
      detail: "Use IRS yearly room, then send leftovers to a taxable brokerage for flexibility before 59½.",
    };
  }, [answers]);

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--muted)]">Answer a few yes/no prompts. No dollar typing required.</p>
      {(
        [
          ["matchAvailable", "My employer offers a match or automatic retirement contribution"],
          ["highInterestDebt", "I have debt around 7%+ interest"],
          ["emergencyReady", "I already have 3–6 months of expenses in cash"],
          ["shortHorizon", "I may leave the US within ~5 years"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={answers[key]}
            onChange={(event) => setAnswers((prev) => ({ ...prev, [key]: event.target.checked }))}
          />
          <span>{label}</span>
        </label>
      ))}
      <div className="rounded-2xl bg-[var(--accent-soft)] p-4">
        <p className="text-xs uppercase tracking-[0.12em]">Your next dollar</p>
        <p className="mt-2 text-xl font-semibold">{next.title}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{next.detail}</p>
      </div>
    </div>
  );
}
