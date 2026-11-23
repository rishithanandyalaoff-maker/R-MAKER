import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound, redirect } from "next/navigation";
import { RulesBadge } from "@/components/rules-badge";
import { AccountPicker } from "@/components/tools/account-picker";
import { BudgetBuilder } from "@/components/tools/budget-builder";
import { PayoffVsInvestTool, RefinanceTool } from "@/components/tools/debt-tools";

const TOOLS: Record<string, { title: string; blurb: string; Component: ComponentType }> = {
  budget: {
    title: "Budget builder",
    blurb: "Category rows and a pie of where pay goes.",
    Component: BudgetBuilder,
  },
  "payoff-vs-invest": {
    title: "Pay off vs invest",
    blurb: "Interest saved vs investing instead.",
    Component: PayoffVsInvestTool,
  },
  refinance: {
    title: "Refinance / visa trade-off",
    blurb: "Loan math plus OPT vs H-1B FICA.",
    Component: RefinanceTool,
  },
  "account-picker": {
    title: "Account picker",
    blurb: "Interactive next-dollar flow.",
    Component: AccountPicker,
  },
};

export function generateStaticParams() {
  return Object.keys(TOOLS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "paycheck") return { title: "Paycheck calculator" };
  if (slug === "projector") return { title: "Net worth projector" };
  return { title: TOOLS[slug]?.title ?? "Tool" };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "paycheck") redirect("/tools/paycheck/");
  if (slug === "projector") redirect("/tools/projector/");

  const tool = TOOLS[slug];
  if (!tool) notFound();
  const Body = tool.Component;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RulesBadge />
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">{tool.title}</h1>
      <p className="mt-3 text-[var(--muted)]">{tool.blurb}</p>
      <div className="mt-8">
        <Body />
      </div>
      <Link href="/tools/" className="mt-8 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm">
        All tools
      </Link>
    </div>
  );
}
