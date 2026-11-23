"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

export function MarkLessonComplete({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const progress = readStorage<Record<string, boolean>>(STORAGE_KEYS.lessonProgress, {});
    setDone(Boolean(progress[lessonId]));
  }, [lessonId]);

  return (
    <button
      type="button"
      className={
        done
          ? "rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm text-[var(--ink)]"
          : "rounded-full border border-[var(--line)] px-4 py-2 text-sm"
      }
      onClick={() => {
        const progress = readStorage<Record<string, boolean>>(STORAGE_KEYS.lessonProgress, {});
        const next = { ...progress, [lessonId]: !done };
        writeStorage(STORAGE_KEYS.lessonProgress, next);
        setDone(!done);
      }}
    >
      {done ? "Marked complete" : "Mark lesson complete"}
    </button>
  );
}
