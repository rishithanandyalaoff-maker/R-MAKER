"use client";

import { clearAllMoneyBasicsData } from "@/lib/storage";

export function ClearDataButton() {
  return (
    <button
      type="button"
      className="underline-offset-2 hover:underline"
      onClick={() => {
        if (window.confirm("Clear lesson progress, quiz answers, and saved calculator inputs on this device?")) {
          clearAllMoneyBasicsData();
          window.location.reload();
        }
      }}
    >
      Clear my data
    </button>
  );
}
