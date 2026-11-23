import type { Metadata } from "next";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = { title: "Myth busters" };

const MYTHS = [
  { myth: "IRAs give lower returns", truth: "Same investments and tax treatment can produce the same results. Match, deductibility, and fees differ." },
  { myth: "Pay off all debt before investing", truth: "High-rate debt first. Low-rate debt can coexist with investing, especially when free employer money is on the table." },
  { myth: "You need a lot of money to start", truth: "Small, steady contributions matter early because of compounding and habit." },
  { myth: "My tax bracket is my tax rate", truth: "Brackets are marginal. Your effective (average) rate is usually lower." },
  { myth: "Moving abroad means cashing out my 401(k)", truth: "You often can leave money invested. Penalties depend on age and rules, not just location — get cross-border advice." },
  { myth: "Roth is always better", truth: "Roth shines when today’s tax rate is low. Traditional can win when today’s rate is high." },
  { myth: "Timing the market beats lump sum", truth: "Historically, lump sum wins often. Monthly investing can still be the plan that you will actually follow." },
];

export default function MythsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Myth busters</h1>
      <div className="mt-8 grid gap-3">
        {MYTHS.map((item) => (
          <article key={item.myth} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{item.myth}</h2>
            <p className="mt-2 text-[var(--muted)]">{item.truth}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
