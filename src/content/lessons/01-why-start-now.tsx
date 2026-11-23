import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { CompoundingWidget } from "@/components/tools/compounding-widget";

export function Lesson01() {
  return (
    <LessonShell slug="01-why-start-now" goal="see why starting early matters more than picking perfect investments.">
      <H2>1. Savings rate comes first</H2>
      <p>Early on, how much you keep matters more than the exact return. A higher savings rate builds the pile that later growth can compound.</p>
      <H2>2. Compounding needs time</H2>
      <p>Compounding means growth earns more growth. Time is the main ingredient. Waiting five years to start is usually costlier than picking a slightly worse fund.</p>
      <H2>3. Your independence number</H2>
      <p>A common teaching shortcut: financial independence is roughly 25× yearly spending. At $3,000/month ($36,000/year), that is about $900,000.</p>
      <Callout variant="example">
        If you keep $1,000/month, the chart below compares pure saving (0% growth → $360,000 after 30 years) with a 7%
        growth assumption (about $1,169,453).
      </Callout>
      <CompoundingWidget />
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Start with a savings habit, not stock tips.</li>
          <li>Time in the market beats delayed perfection.</li>
          <li>Independence ≈ 25× yearly spending.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
