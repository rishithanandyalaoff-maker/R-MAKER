import Link from "next/link";
import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { PaycheckCalculator } from "@/components/tools/paycheck-calculator";
import { EMPLOYEE_401K_LIMIT, STANDARD_DEDUCTION } from "@/lib/rules/2026";
import { formatMoney } from "@/lib/format";

export function Lesson02() {
  return (
    <LessonShell
      slug="02-your-paycheck"
      goal="read a US paycheck from gross pay to take-home, and know which pieces change for international students."
    >
      <H2>1. Gross pay is the starting number</H2>
      <p>
        <strong>Gross pay</strong> is your salary before anything is taken out. A $150,000 offer means about{" "}
        {formatMoney(150_000 / 12)} per month before taxes and benefits.
      </p>

      <H2>2. Pre-tax bites come next</H2>
      <p>
        Many employers take <strong>traditional 401(k)</strong> contributions and health premiums before federal income
        tax. That lowers taxable income. Roth 401(k) contributions do not lower federal taxable income.
      </p>
      <p>
        The employee 401(k) limit for this tax year is {formatMoney(EMPLOYEE_401K_LIMIT)}. The calculator shows that
        limit but defaults your contribution to $0 until you choose otherwise — we will not invent a savings rate for
        you.
      </p>

      <H2>3. Federal tax uses brackets</H2>
      <p>
        The US taxes income in layers. Your <strong>marginal rate</strong> is the rate on your next dollar. Your{" "}
        <strong>effective rate</strong> is total federal tax divided by income — usually lower.
      </p>
      <p>
        Most people also get a <strong>standard deduction</strong> ({formatMoney(STANDARD_DEDUCTION.single)} if single)
        before brackets apply. You do not need to memorize the table; the tool uses the public numbers.
      </p>

      <H2>4. FICA is Social Security + Medicare</H2>
      <p>
        <strong>FICA</strong> is separate from federal income tax. It funds Social Security and Medicare. Traditional
        401(k) contributions usually do not reduce FICA. Pre-tax health premiums usually lower FICA too; traditional
        401(k) contributions do not.
      </p>

      <Callout variant="visa">
        F-1 / OPT nonresidents in their first five calendar years are often exempt from Social Security and Medicare.
        H-1B workers generally pay FICA. Check the box in the calculator only if that describes you, and confirm with
        your school’s international office.
      </Callout>

      <H2>5. State tax and bonuses</H2>
      <p>
        Some states (Texas, Florida, Washington, and others) have no wage income tax. The calculator defaults state tax
        to 0%. Bonuses are often withheld at a flat federal supplemental rate (22%) — that withholding is not always your
        final tax on the bonus.
      </p>

      <Callout variant="example">
        Worked example: {formatMoney(150_000)} salary, single, {formatMoney(24_500)} traditional 401(k),{" "}
        {formatMoney(3_000)} health premiums, no state tax → about {formatMoney(7_760)}/month take-home. The calculator
        below starts with a $0 401(k), so it shows a higher take-home. Open optional details and enter $24,500 to match
        this example.
      </Callout>

      <H2>Interactive: paycheck calculator</H2>
      <p className="text-[var(--muted)]">Minimum input: salary. Optional: F-1/OPT. Everything else is defaulted.</p>
      <PaycheckCalculator />
      <p className="text-sm">
        Open alone at{" "}
        <Link href="/tools/paycheck/" className="underline">
          /tools/paycheck
        </Link>
        .
      </p>

      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Take-home is what remains after pre-tax benefits, federal tax, FICA, and state tax.</li>
          <li>Marginal rate ≠ average rate.</li>
          <li>Pre-tax health usually lowers FICA; traditional 401(k) does not.</li>
          <li>FICA rules can differ on F-1/OPT vs H-1B.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
