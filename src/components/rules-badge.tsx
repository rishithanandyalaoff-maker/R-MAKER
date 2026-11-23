import { RULES_LABEL } from "@/lib/rules/2026";

export function RulesBadge() {
  return (
    <p className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium tracking-wide text-[var(--ink)]">
      {RULES_LABEL}
    </p>
  );
}
