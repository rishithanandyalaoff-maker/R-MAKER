import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";

export function Lesson07() {
  return (
    <LessonShell slug="07-getting-money-out" goal="know the big withdrawal rules so accounts do not surprise you.">
      <H2>1. The 59½ idea</H2>
      <p>
        Many retirement accounts discourage early withdrawals with an extra tax penalty before age 59½ (with exceptions).
        Treat 401(k) and IRA money as long-horizon unless you learn a specific exception that fits you.
      </p>
      <H2>2. Roth contribution ordering (simplified)</H2>
      <p>
        Teaching model for Roth IRAs: your regular Roth IRA contributions can always come out first, tax- and
        penalty-free. Earnings have tighter rules.
      </p>
      <p>Early-withdrawal exceptions that can help with IRA earnings (details vary — confirm before withdrawing):</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>First home (up to $10,000 lifetime)</li>
        <li>Qualified higher education (taxed, no penalty)</li>
        <li>Birth or adoption (up to $5,000)</li>
        <li>One emergency withdrawal of up to $1,000 per year</li>
        <li>Disability</li>
        <li>Large medical bills</li>
      </ul>
      <p>
        Converted amounts (e.g., backdoor Roth) are penalty-free after 5 years each. Many 401(k) plans allow loans of up
        to $50,000. Leaving a job in or after the year you turn 55 can allow penalty-free 401(k) withdrawals from that
        employer&apos;s plan. A Roth 401(k) can be rolled into a Roth IRA after you leave.
      </p>
      <H2>3. Why brokerage is flexible</H2>
      <p>
        A taxable brokerage has no age lock for your own money. You may owe capital gains tax when you sell winners,
        but you can access funds for a house, a move, or leaving the US without a retirement-penalty frame.
      </p>
      <Callout variant="example">
        Someone who may leave the US in 3–5 years often still takes the employer match, then favors brokerage and cash
        over maximizing locked retirement room.
      </Callout>
      <H2>4. Short-horizon path</H2>
      <p>
        If your US stay might be short: capture free money, keep a stronger cash buffer, invest remaining dollars where
        you can reach them, and avoid assuming you will wait until 59½.
      </p>
      <Callout variant="watch">
        Leaving the US can create tax-filing and treaty questions. This lesson is about liquidity, not exit tax advice.
      </Callout>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Retirement accounts are mostly long-horizon tools.</li>
          <li>Brokerage = flexible access with possible capital gains tax.</li>
          <li>Short US horizon → more liquidity after free match.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
