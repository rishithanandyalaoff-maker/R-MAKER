import type { Metadata } from "next";
import Link from "next/link";
import { NetWorthProjector } from "@/components/tools/net-worth-projector";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = {
  title: "Net worth projector",
  description: "Project a path to a dollar goal by an age with minimal inputs and public-rule defaults.",
};

export default function ProjectorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Net worth projector</h1>
      <p className="mt-3 max-w-3xl text-[var(--muted)]">
        Enter age, salary, and a goal. Optional: visa status, short US horizon, student loans. Everything else is filled
        from public limits and plain defaults.
      </p>
      <div className="mt-8">
        <NetWorthProjector />
      </div>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Next:{" "}
        <Link href="/plan/" className="underline underline-offset-2">
          turn this into a printable plan
        </Link>
      </p>
    </div>
  );
}
