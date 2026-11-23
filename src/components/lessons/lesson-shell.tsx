import Link from "next/link";
import type { ReactNode } from "react";
import { RulesBadge } from "@/components/rules-badge";
import { MarkLessonComplete } from "@/components/lessons/mark-lesson-complete";
import { LESSONS } from "@/lib/lessons";

export function LessonShell({
  slug,
  goal,
  children,
}: {
  slug: string;
  goal: string;
  children: ReactNode;
}) {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug);
  const lesson = LESSONS[index];
  const next = LESSONS[index + 1];
  const prev = LESSONS[index - 1];

  if (!lesson) return null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Lesson {lesson.number} of {LESSONS.length}
        {lesson.visaOnly ? " · For internationals" : ""}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">{lesson.title}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">Learning goal: {goal}</p>
      <div className="prose-narrow mt-8 grid gap-4">{children}</div>
      <div className="mt-10 flex flex-wrap gap-3">
        <MarkLessonComplete lessonId={slug} />
        {prev ? (
          <Link href={`/learn/${prev.slug}/`} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
            Previous
          </Link>
        ) : null}
        {next ? (
          <Link href={`/learn/${next.slug}/`} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white">
            Next: {next.title}
          </Link>
        ) : (
          <Link href="/plan/" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white">
            Build your plan
          </Link>
        )}
      </div>
    </article>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl">{children}</h2>;
}
