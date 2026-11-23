"use client";

import { useMemo, useState } from "react";
import { RulesBadge } from "@/components/rules-badge";
import { searchGlossary } from "@/lib/glossary";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const terms = useMemo(() => searchGlossary(query), [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Glossary</h1>
      <p className="mt-3 text-[var(--muted)]">{terms.length} terms used across the lessons and tools.</p>
      <label className="mt-6 block">
        <span className="sr-only">Search glossary</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search terms"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3"
        />
      </label>
      <ul className="mt-6 grid gap-3">
        {terms.map((term) => (
          <li key={term.id} id={term.id} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
            <h2 className="text-xl font-semibold text-[var(--ink)]">{term.term}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{term.short}</p>
            <p className="mt-2 text-[var(--ink)]">{term.definition}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
