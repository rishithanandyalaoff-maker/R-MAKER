import Link from "next/link";
import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { AccountPicker } from "@/components/tools/account-picker";
import { RothCompareWidget } from "@/components/tools/roth-compare-widget";
import {
  EMPLOYEE_401K_LIMIT,
  IRA_DEDUCTION_PHASE_OUT,
  IRA_LIMIT,
  ROTH_IRA_PHASE_OUT,
} from "@/lib/rules/2026";
import { formatMoney } from "@/lib/format";

export function Lesson06() {
  return (
    <LessonShell slug="06-retirement-accounts" goal="tell 401(k) from IRA and traditional from Roth.">
      <H2>1. Employer plan vs IRA</H2>
      <p>
        A <strong>401(k)</strong> is offered through work. An <strong>IRA</strong> is an account you open yourself. A
        401(k) can be traditional (pre-tax) or Roth (after-tax). An IRA can also be traditional or Roth, with two income
        rules:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Traditional IRA contributions are tax-deductible only if your income is low enough. If you have a workplace
          plan, the 2026 deduction phases out at about {formatMoney(IRA_DEDUCTION_PHASE_OUT.single[0])}–
          {formatMoney(IRA_DEDUCTION_PHASE_OUT.single[1])} for single filers. Above that, a traditional IRA has no
          upfront tax break.
        </li>
        <li>
          Roth IRA contributions phase out at about {formatMoney(ROTH_IRA_PHASE_OUT.single[0])}–
          {formatMoney(ROTH_IRA_PHASE_OUT.single[1])} (single) and {formatMoney(ROTH_IRA_PHASE_OUT.mfj[0])}–
          {formatMoney(ROTH_IRA_PHASE_OUT.mfj[1])} (married filing jointly).
        </li>
      </ul>
      <p>Above those limits, many people use a backdoor Roth (below).</p>
      <p>
        This year&apos;s teaching limits: employee 401(k) {formatMoney(EMPLOYEE_401K_LIMIT)}; IRA{" "}
        {formatMoney(IRA_LIMIT)}. Confirm on IRS.gov before acting.
      </p>

      <H2>2. Match vs automatic contribution</H2>
      <p>
        A match pays only if you contribute (e.g., 50% of what you put in up to 6% of pay); an automatic contribution
        arrives regardless. Check the vesting schedule — unvested employer money is lost if you leave early — and whether
        you must be employed on the payment date.
      </p>

      <H2>3. Traditional vs Roth</H2>
      <p>
        Traditional lowers taxable income now; you pay tax later. Roth does not lower income now; qualified withdrawals
        later are tax-free. When today&apos;s and tomorrow&apos;s tax rates match, results can match — see the worked
        comparison.
      </p>
      <RothCompareWidget />

      <H2>4. Backdoor Roth</H2>
      <p>
        Contribute to a traditional IRA (non-deductible), convert to Roth soon after. Keep your pre-tax IRA balance at $0
        because of the pro-rata rule; never roll an old 401(k) into an IRA if you use the backdoor — roll it into the next
        employer&apos;s 401(k).
      </p>

      <H2>5. Mega backdoor Roth</H2>
      <p>
        Some 401(k) plans allow after-tax contributions beyond {formatMoney(EMPLOYEE_401K_LIMIT)} plus in-plan Roth
        conversion. Ask HR.
      </p>

      <H2>6. HSA</H2>
      <p>
        If you have a high-deductible health plan, an HSA is tax-free in, while invested, and out for medical costs.
      </p>

      <H2>7. Where the next dollar goes</H2>
      <AccountPicker />
      <p className="text-sm">
        Full tool:{" "}
        <Link href="/tools/account-picker/" className="underline">
          /tools/account-picker
        </Link>
      </p>
      <Callout variant="visa">
        Contribution eligibility and treaty effects can differ for nonresidents. Use this as education, then confirm
        with a tax professional who knows cross-border rules.
      </Callout>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>401(k) = work plan; IRA = your own (with income phase-outs).</li>
          <li>Match first when available; check vesting.</li>
          <li>Roth vs traditional hinges on tax rates now vs later.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
