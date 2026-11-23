import Link from "next/link";
import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { BudgetBuilder } from "@/components/tools/budget-builder";

export function Lesson03() {
  return (
    <LessonShell slug="03-budget" goal="set a simple budget that pays you first without tracking every coffee.">
      <H2>1. Fixed vs variable</H2>
      <p>
        Fixed costs (rent, insurance, minimum debt payments) are hard to change month to month. Variable costs (food,
        fun, travel) flex. Start by knowing the fixed floor, then decide what leftover becomes saving.
      </p>
      <H2>2. Pay yourself first</H2>
      <p>
        Treat saving like a bill. Automate a transfer or 401(k) contribution on payday so lifestyle expands only after
        the savings line is funded.
      </p>
      <H2>3. A workable target</H2>
      <p>
        A teaching target for new grads: keep living costs near 50% of take-home or less when possible, so the rest can
        fund debt, emergency cash, and investing. High-cost cities may run hotter — then raise income or share housing
        rather than skipping the safety net.
      </p>
      <Callout variant="example">
        Enter salary below. Take-home is estimated with public tax defaults. Adjust only the spending lines you care
        about.
      </Callout>
      <BudgetBuilder />
      <p className="text-sm">
        Open the standalone tool anytime at{" "}
        <Link href="/tools/budget/" className="underline">
          /tools/budget
        </Link>
        .
      </p>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Know fixed costs first.</li>
          <li>Automate saving on payday.</li>
          <li>Watch living share of take-home; leave room for goals.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
