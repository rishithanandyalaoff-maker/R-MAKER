"use client";

import { useMemo, useState } from "react";
import { loanPayment, refinanceSavings, simulatePayoffVsInvest } from "@/lib/calc/loan";
import { formatMoney } from "@/lib/format";

export function PayoffVsInvestTool() {
  const [balance, setBalance] = useState(50_000);
  const [loanRate, setLoanRate] = useState(7);
  const [termYears, setTermYears] = useState(5);
  const [extra, setExtra] = useState(500);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [horizonYears, setHorizonYears] = useState(5);

  const termMonths = Math.max(1, Math.round(termYears * 12));
  const required = loanPayment(balance, loanRate / 100, termMonths);

  const result = useMemo(
    () =>
      simulatePayoffVsInvest({
        principal: balance,
        loanRate: loanRate / 100,
        requiredPayment: required,
        extraMonthly: extra,
        expectedReturn: expectedReturn / 100,
        years: horizonYears,
      }),
    [balance, loanRate, required, extra, expectedReturn, horizonYears],
  );

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--muted)]">
        Compare putting extra dollars toward the loan versus investing them. Same cash each month either way.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Num label="Loan balance ($)" value={balance} onChange={setBalance} />
        <Num label="Loan rate (%)" value={loanRate} onChange={setLoanRate} step={0.1} />
        <Num label="Amortization term (years)" value={termYears} onChange={setTermYears} />
        <Num label="Extra $/month" value={extra} onChange={setExtra} />
        <Num label="Expected return (%)" value={expectedReturn} onChange={setExpectedReturn} step={0.1} />
        <Num label="Years to compare" value={horizonYears} onChange={setHorizonYears} />
      </div>
      <p className="text-sm">Required monthly payment: {formatMoney(result.requiredPayment)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Snapshot
          title="A — Prepay with extra"
          investments={result.scenarioA.investments}
          loan={result.scenarioA.loanBalance}
          netWorth={result.scenarioA.netWorth}
        />
        <Snapshot
          title="B — Invest the extra"
          investments={result.scenarioB.investments}
          loan={result.scenarioB.loanBalance}
          netWorth={result.scenarioB.netWorth}
        />
      </div>
      <p className="text-sm">
        Difference (A − B): {formatMoney(result.difference)}. When the loan rate equals your expected return, the two
        choices end about even. Prepaying gives a guaranteed return equal to the loan rate; investing gives an uncertain
        one.
      </p>
    </div>
  );
}

function Snapshot({
  title,
  investments,
  loan,
  netWorth,
}: {
  title: string;
  investments: number;
  loan: number;
  netWorth: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm">
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 grid gap-1">
        <li>Investments: {formatMoney(investments)}</li>
        <li>Remaining loan: {formatMoney(loan)}</li>
        <li>Net worth: {formatMoney(netWorth)}</li>
      </ul>
    </div>
  );
}

export function RefinanceTool() {
  const [balance, setBalance] = useState(100_000);
  const [currentRate, setCurrentRate] = useState(8);
  const [newRate, setNewRate] = useState(5);
  const [years, setYears] = useState(10);
  const [salary, setSalary] = useState(150_000);
  const [healthPremiums, setHealthPremiums] = useState(3_000);
  const [h1bYears, setH1bYears] = useState(3);

  const savings = refinanceSavings({
    balance,
    currentRate: currentRate / 100,
    newRate: newRate / 100,
    years,
  });
  const ficaCost = useMemo(() => {
    const ficaWages = Math.max(0, salary - healthPremiums);
    return ficaWages * 0.0765 * h1bYears;
  }, [salary, healthPremiums, h1bYears]);

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--muted)]">
        Minimal inputs for a refinance sketch. Visa trade-off uses a flat 7.65% FICA estimate on salary minus pre-tax
        health premiums.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Num label="Loan balance ($)" value={balance} onChange={setBalance} />
        <Num label="Current rate (%)" value={currentRate} onChange={setCurrentRate} step={0.1} />
        <Num label="Refinanced rate (%)" value={newRate} onChange={setNewRate} step={0.1} />
        <Num label="Term (years)" value={years} onChange={setYears} />
        <Num label="Salary for FICA sketch ($)" value={salary} onChange={setSalary} />
        <Num label="Pre-tax health premiums ($/yr)" value={healthPremiums} onChange={setHealthPremiums} />
        <Num label="Years that would have been FICA-exempt" value={h1bYears} onChange={setH1bYears} />
      </div>
      <p className="text-sm text-[var(--muted)]">
        Count only the years you would otherwise have been FICA-exempt (generally your first 5 calendar years on F-1).
        Social Security does pay benefits after about 10 years of US work.
      </p>
      <ul className="grid gap-2 text-sm">
        <li>Current payment: {formatMoney(savings.currentPayment)}</li>
        <li>New payment: {formatMoney(savings.newPayment)}</li>
        <li>Interest saved: {formatMoney(savings.interestSaved)}</li>
        <li>Rough FICA paid over those years: {formatMoney(ficaCost)}</li>
        <li>
          Net sketch (interest saved − FICA): {formatMoney(savings.interestSaved - ficaCost)}. Confirm visas and lending
          rules with professionals.
        </li>
      </ul>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
