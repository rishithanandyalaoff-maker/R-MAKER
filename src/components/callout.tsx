import type { ReactNode } from "react";
import { cn } from "@/lib/format";

const STYLES = {
  example: "border-[var(--blue)] bg-[var(--blue-soft)]",
  visa: "border-[var(--lilac)] bg-[var(--lilac-soft)]",
  watch: "border-[var(--amber)] bg-[var(--amber-soft)]",
  takeaways: "border-[var(--green)] bg-[var(--green-soft)]",
} as const;

const LABELS = {
  example: "Example",
  visa: "Visa note",
  watch: "Watch out",
  takeaways: "Key takeaways",
} as const;

export function Callout({
  variant,
  children,
  title,
}: {
  variant: keyof typeof STYLES;
  children: ReactNode;
  title?: string;
}) {
  return (
    <aside className={cn("my-6 rounded-2xl border px-4 py-4 text-[0.95rem] leading-relaxed", STYLES[variant])}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">{title ?? LABELS[variant]}</p>
      <div className="text-[var(--ink)]">{children}</div>
    </aside>
  );
}
