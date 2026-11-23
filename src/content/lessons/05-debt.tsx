import Link from "next/link";
import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { PayoffVsInvestTool, RefinanceTool } from "@/components/tools/debt-tools";

export function Lesson05() {
  return (
    <LessonShell slug="05-debt" goal="decide when to pay debt hard vs invest, and sketch a refinance trade-off.">
      <H2>1. Not all debt is equal</H2>
      <p>
        Credit cards and high private loan rates are expensive. A low-rate mortgage or loan can be cheaper than expected
        investment returns. Note that recent federal graduate loan rates have been around 8–9%, and international
        students generally cannot get federal loans. The rate is the main signal.
      </p>
      <H2>2. A simple rule of thumb</H2>
      <p>
        Above ~7–8%: lean toward aggressive payoff. Around 5% or less: minimum payments plus investing can win more
        often. In between: personal — also weigh stress and visa timelines.
      </p>
      <Callout variant="example">
        Compare putting an extra $500/month toward a loan versus investing it — same cash either way.
      </Callout>
      <PayoffVsInvestTool />
      <H2>3. Refinance basics</H2>
      <p>
        Refinancing swaps an old rate for a new one (sometimes with fees). Lower interest can save a lot — but read
        terms. For internationals, some loans or cosigners change with visa status. Refinancing federal loans into a
        private loan permanently gives up federal protections such as income-driven repayment and forgiveness programs.
      </p>
      <Callout variant="visa">
        Moving from OPT (often FICA-exempt early on) to H-1B usually means paying Social Security and Medicare. That is
        not a reason to avoid legal work status — just include it in cash-flow planning.
      </Callout>
      <RefinanceTool />
      <p className="text-sm">
        Standalone pages:{" "}
        <Link href="/tools/payoff-vs-invest/" className="underline">
          payoff vs invest
        </Link>{" "}
        ·{" "}
        <Link href="/tools/refinance/" className="underline">
          refinance
        </Link>
      </p>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Rate drives the payoff-vs-invest decision.</li>
          <li>~7%+ → pay hard; ~5%− → investing can compete.</li>
          <li>Refinance math ≠ visa advice — confirm both separately.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
