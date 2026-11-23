import Link from "next/link";
import type { Metadata } from "next";
import { RulesBadge } from "@/components/rules-badge";
import { LESSONS } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learning path",
};

export default function LearnIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Learning path</h1>
      <p className="mt-3 text-[var(--muted)]">
        Eleven lessons in order. Each includes a worked example or tool, plus key takeaways. Work top to bottom, or jump
        to the topic you need.
      </p>
      <ol className="mt-8 grid gap-3">
        {LESSONS.map((lesson) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${lesson.slug}/`}
              className="block rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Lesson {lesson.number}
                {lesson.visaOnly ? " · International" : ""}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">{lesson.title}</h2>
              <p className="mt-1 text-[var(--muted)]">{lesson.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Prefer the order of operations? See{" "}
        <Link href="/flow/" className="underline">
          the flow
        </Link>
        , then{" "}
        <Link href="/plan/" className="underline">
          build your plan
        </Link>
        .
      </p>
    </div>
  );
}
