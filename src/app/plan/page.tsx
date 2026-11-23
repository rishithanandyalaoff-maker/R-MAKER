import type { Metadata } from "next";
import { PlanBuilder } from "@/components/plan/plan-builder";
import { RulesBadge } from "@/components/rules-badge";

export const metadata: Metadata = {
  title: "Plan builder",
  description: "Build a starter US money plan with minimal inputs and public-rule defaults.",
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Build my plan</h1>
      <p className="mt-3 text-[var(--muted)]">
        A few answers. A funding structure. A projection. Print when you want a paper copy for onboarding or January
        reviews.
      </p>
      <div className="mt-8">
        <PlanBuilder />
      </div>
    </div>
  );
}
