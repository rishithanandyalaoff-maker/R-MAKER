import type { Metadata } from "next";
import Link from "next/link";
import { PaycheckCalculator } from "@/components/tools/paycheck-calculator";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = {
  title: "Paycheck calculator",
  description: "Estimate take-home pay with minimal inputs. Tax brackets and limits come from public 2026 IRS rules.",
};

export default function PaycheckToolPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Paycheck calculator</h1>
      <p className="mt-3 text-[var(--muted)]">
        Enter salary (and optionally F-1/OPT). Brackets, FICA, the 401(k) limit, and other defaults come from public rules.
      </p>
      <div className="mt-8">
        <PaycheckCalculator />
      </div>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Related lesson:{" "}
        <Link href="/learn/02-your-paycheck/" className="underline underline-offset-2">
          Your paycheck, decoded
        </Link>
      </p>
    </div>
  );
}
