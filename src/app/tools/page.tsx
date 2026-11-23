import Link from "next/link";
import type { Metadata } from "next";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = { title: "Tools" };

const TOOLS = [
  {
    href: "/tools/paycheck/",
    title: "Paycheck calculator",
    blurb: "Salary (+ optional F-1/OPT). Brackets and limits auto-filled.",
  },
  { href: "/tools/budget/", title: "Budget builder", blurb: "Where pay goes, with a living-cost warning." },
  {
    href: "/tools/projector/",
    title: "Net worth projector",
    blurb: "Age, salary, goal — then public-rule defaults project the path.",
  },
  { href: "/tools/payoff-vs-invest/", title: "Pay off vs invest", blurb: "Compare loan rate to expected return." },
  { href: "/tools/refinance/", title: "Refinance / visa trade-off", blurb: "Interest saved vs FICA on H-1B." },
  { href: "/tools/account-picker/", title: "Account picker", blurb: "Where your next dollar should go." },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Tools</h1>
      <p className="mt-3 text-[var(--muted)]">
        Calculators ask for as little as possible. Public IRS rules and simple defaults fill the rest. All math stays in
        your browser.
      </p>
      <ul className="mt-8 grid gap-3">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 hover:border-[var(--accent)]"
            >
              <h2 className="text-xl font-semibold">{tool.title}</h2>
              <p className="mt-1 text-[var(--muted)]">{tool.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
