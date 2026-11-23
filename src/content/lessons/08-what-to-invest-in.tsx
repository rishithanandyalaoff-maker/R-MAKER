import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { CompoundingWidget } from "@/components/tools/compounding-widget";

export function Lesson08() {
  return (
    <LessonShell slug="08-what-to-invest-in" goal="pick a simple, diversified default instead of stock picking.">
      <H2>1. Own the market cheaply</H2>
      <p>
        Broad index funds are the teaching default. Neutral examples (tickers change — confirm before buying): US total
        market (e.g. VTI), international (e.g. VXUS), whole world (e.g. VT), or a target-date fund that mixes stocks and
        bonds for you.
      </p>
      <p>
        Fees matter. On $10,000, a 0.03% expense ratio costs about $3/year; a 1% fee costs about $100/year. Prefer low
        expense ratios.
      </p>
      <H2>2. Allocation = risk dial</H2>
      <p>
        Stocks grow more over long periods but swing hard. Bonds and cash swing less. Younger investors with long
        horizons often hold more stocks; money needed within a few years stays safer. A typical long-term stock split is
        about 70% US / ~20–30% international. Rebalance about once a year.
      </p>
      <H2>3. Taxes in a brokerage</H2>
      <p>
        Assets held over a year usually qualify for long-term capital gains rates of 0%, 15%, or 20% depending on income.
        The wash-sale rule can disallow a loss if you buy a “substantially identical” security within 30 days — including
        buying the replacement in an IRA.
      </p>
      <H2>4. Simple rules of thumb</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Automate contributions every paycheck.</li>
        <li>Prefer low expense ratios.</li>
        <li>Ignore day-to-day market noise.</li>
        <li>Do not invest emergency cash in stocks.</li>
        <li>Individual stocks ≤10% of total, no single stock &gt;5%, brokerage account only.</li>
        <li>Lump sum has beaten spreading out about two-thirds of the time historically.</li>
      </ul>
      <Callout variant="example">
        The same compounding chart from Lesson 1: steady contributions matter more than clever ticker picks. After 30
        years, $1,000/month is $360,000 from saving alone vs about $1,169,453 with a 7% growth assumption.
      </Callout>
      <CompoundingWidget />
      <Callout variant="watch">
        Past returns are not guarantees. The 7% figure used in tools is a long-run teaching assumption, not a promise.
        Consulting, finance and tech employers often restrict personal trading. Read your employer&apos;s policy before
        buying individual stocks.
      </Callout>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Broad low-cost funds beat most DIY stock picking for beginners.</li>
          <li>Match risk to time horizon; rebalance yearly.</li>
          <li>Consistency beats cleverness.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
