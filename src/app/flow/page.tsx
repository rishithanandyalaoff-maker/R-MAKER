import Link from "next/link";
import type { Metadata } from "next";
import { Callout } from "@/components/callout";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = { title: "The flow" };

const STEPS: { text: string; href?: string }[] = [
  { text: "Before day one: cash for needs within 2 years; rest toward Roth IRA if you have earned income", href: "/learn/04-safety-net/" },
  { text: "Paycheck arrives: taxes out; 401(k) at least up to the full match", href: "/learn/02-your-paycheck/" },
  { text: "Living costs: fixed budget, ideally about 25–30% of gross for housing when possible", href: "/learn/03-budget/" },
  { text: "Decision: debt above ~7%? Yes → pay it down first", href: "/learn/05-debt/" },
  { text: "Emergency fund: 3–6 months (lean ~6 on a visa)", href: "/learn/04-safety-net/" },
  { text: "Roth IRA: yearly limit; backdoor if income is high", href: "/learn/06-retirement-accounts/" },
  { text: "Decision: staying in the US 5+ more years? No → short-horizon path", href: "/learn/07-getting-money-out/" },
  { text: "Max 401(k) and HSA when the path is long-horizon", href: "/learn/06-retirement-accounts/" },
  { text: "Brokerage: everything left", href: "/learn/08-what-to-invest-in/" },
  { text: "Loop: next paycheck; review every January", href: "/plan/" },
];

export default function FlowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">The flow</h1>
      <p className="mt-3 text-[var(--muted)]">
        Order of operations for every paycheck. Tap a step to open the matching lesson or plan page.
      </p>
      <ol className="mt-8 grid gap-3">
        {STEPS.map((step, index) => (
          <li key={step.text}>
            {step.href ? (
              <Link
                href={step.href}
                className="block rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Step {index + 1}</p>
                <p className="mt-1 text-[var(--ink)]">{step.text}</p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Step {index + 1}</p>
                <p className="mt-1 text-[var(--ink)]">{step.text}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
      <Callout variant="visa">
        Short-horizon path: take employer free money, keep more in brokerage and cash, use a safer mix, and pay
        high-rate debt faster. Details in{" "}
        <Link href="/learn/09-visa-and-cross-border/" className="underline">
          visa and cross-border
        </Link>
        .
      </Callout>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/tools/account-picker/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white">
          Account picker
        </Link>
        <Link href="/plan/" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          Build my plan
        </Link>
      </div>
    </div>
  );
}
