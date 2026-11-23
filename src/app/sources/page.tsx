import type { Metadata } from "next";
import { RulesBadge } from "@/components/rules-badge";
import { TAX_YEAR } from "@/lib/rules/2026";

export const metadata: Metadata = { title: "Sources" };

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Sources</h1>
      <p className="mt-3 text-[var(--muted)]">
        Tax numbers live in <code>src/lib/rules/{TAX_YEAR}.ts</code>. Verify against IRS.gov before treating them as
        final.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-[var(--ink)]">
        <li>IRS.gov — federal brackets, standard deduction, contribution limits, Social Security wage base</li>
        <li>
          <a className="underline" href="https://www.irs.gov/publications/p519" target="_blank" rel="noreferrer">
            IRS Publication 519
          </a>{" "}
          — US Tax Guide for Aliens
        </li>
        <li>
          <a className="underline" href="https://www.irs.gov/publications/p901" target="_blank" rel="noreferrer">
            IRS Publication 901
          </a>{" "}
          — US Tax Treaties
        </li>
        <li>
          <a
            className="underline"
            href="https://www.fincen.gov/report-foreign-bank-and-financial-accounts"
            target="_blank"
            rel="noreferrer"
          >
            FinCEN FBAR
          </a>{" "}
          — Report of Foreign Bank and Financial Accounts
        </li>
        <li>
          <a
            className="underline"
            href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations"
            target="_blank"
            rel="noreferrer"
          >
            USCIS H-1B
          </a>{" "}
          — cap season and temporary worker pages
        </li>
        <li>SSA.gov — Social Security wage base and FICA basics</li>
        <li>Your employer HR / benefits portal — match vs automatic contribution, vesting, trading policy</li>
        <li>Your school international student office — OPT, STEM OPT, cap-gap, tax workshops</li>
      </ul>
      <p className="mt-6 text-sm text-[var(--muted)]">
        TODO before launch: tick every constant in the rules file against the official {TAX_YEAR} publications.
      </p>
    </div>
  );
}
