"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export function LessonQuiz({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: QuizQuestion[];
}) {
  const storageKey = `${STORAGE_KEYS.lessonProgress}:${lessonId}:quiz`;
  const [selected, setSelected] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readStorage<{ selected?: Record<string, number | null>; revealed?: Record<string, boolean> }>(
      storageKey,
      {},
    );
    if (saved.selected) setSelected(saved.selected);
    if (saved.revealed) setRevealed(saved.revealed);
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    writeStorage(storageKey, { selected, revealed });
  }, [selected, revealed, ready, storageKey]);

  return (
    <div className="mt-8 grid gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl">Quick check</h2>
      <p className="text-sm text-[var(--muted)]">Three questions to lock in the visa money basics.</p>
      {questions.map((q, index) => {
        const choice = selected[q.id] ?? null;
        const show = revealed[q.id];
        return (
          <fieldset key={q.id} className="grid gap-2 border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
            <legend className="text-sm font-semibold">
              {index + 1}. {q.prompt}
            </legend>
            <div className="grid gap-2">
              {q.choices.map((label, choiceIndex) => {
                const isCorrect = choiceIndex === q.answer;
                const isPicked = choice === choiceIndex;
                return (
                  <label
                    key={label}
                    className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-sm ${
                      show && isCorrect
                        ? "border-[var(--green)] bg-[var(--green-soft)]"
                        : show && isPicked && !isCorrect
                          ? "border-[var(--amber)] bg-[var(--amber-soft)]"
                          : "border-[var(--line)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="mt-1"
                      checked={isPicked}
                      onChange={() => {
                        setSelected((prev) => ({ ...prev, [q.id]: choiceIndex }));
                        setRevealed((prev) => ({ ...prev, [q.id]: true }));
                      }}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
            {show ? <p className="text-sm text-[var(--muted)]">{q.explanation}</p> : null}
          </fieldset>
        );
      })}
    </div>
  );
}
