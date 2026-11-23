import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Wrench } from "lucide-react";
import { RulesBadge } from "@/components/rules-badge";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <RulesBadge />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Money Basics</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl">
          Learn money from zero and build your own plan in an afternoon.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
          Made for new graduates starting a US job — including international students on F-1, OPT, or H-1B. Plain
          English, real dollar examples, and tools that run only in your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/learn/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Start learning
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/plan/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Build my plan
            <Compass className="h-4 w-4" />
          </Link>
          <Link
            href="/tools/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Open tools
            <Wrench className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <aside className="mt-12 max-w-2xl rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl">What you will get</h2>
        <ul className="mt-4 grid gap-3 text-[var(--muted)]">
          <li>11 lessons from “what is a paycheck?” to “build my plan.”</li>
          <li>Calculators for take-home pay, budget, debt, and net worth.</li>
          <li>A paycheck-to-investing flow with a short-horizon path for people who may leave the US.</li>
          <li>No login. No server storage. Clear your data anytime.</li>
        </ul>
      </aside>
    </div>
  );
}
