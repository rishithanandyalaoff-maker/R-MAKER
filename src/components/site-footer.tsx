import Link from "next/link";
import { RULES_LABEL } from "@/lib/rules/2026";
import { ClearDataButton } from "@/components/clear-data-button";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] sm:px-6">
        <p>
          Educational only — not financial, tax, legal or immigration advice. Rules shown are US federal rules for tax year 2026;
          confirm with IRS.gov, your employer&apos;s HR, your school&apos;s international office, or a licensed professional.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>{RULES_LABEL}</span>
          <Link href="/glossary/" className="underline-offset-2 hover:underline">
            Glossary
          </Link>
          <Link href="/sources/" className="underline-offset-2 hover:underline">
            Sources
          </Link>
          <Link href="/myths/" className="underline-offset-2 hover:underline">
            Myth busters
          </Link>
          <ClearDataButton />
        </div>
      </div>
    </footer>
  );
}
