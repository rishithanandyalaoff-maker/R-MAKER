import Link from "next/link";
import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";

export function Lesson11() {
  return (
    <LessonShell slug="11-build-your-plan" goal="turn the lessons into a written plan you can revisit.">
      <H2>1. Pull the pieces together</H2>
      <p>
        You now have the map: paycheck → budget → safety net → debt → accounts → investments → protection. The Plan
        Builder stores your numbers on this device and prints a one-pager.
      </p>
      <H2>2. Suggested checklist</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Estimate take-home with the paycheck tool.</li>
        <li>Set living costs and a savings transfer.</li>
        <li>Capture employer match if offered.</li>
        <li>Attack high-rate debt; refinance only with clear math.</li>
        <li>Fund 3–6 months of essentials in an HYSA.</li>
        <li>Choose Roth vs traditional with your tax picture in mind.</li>
        <li>Automate a simple index or target-date investment.</li>
        <li>Confirm beneficiaries and basic insurance.</li>
      </ul>
      <H2>3. Revisit yearly</H2>
      <p>
        Every January (or after a job change): update salary, check contribution limits, rebalance if needed, and
        reread the flow page.
      </p>
      <Callout variant="example">
        Open{" "}
        <Link href="/plan/" className="underline">
          Plan Builder
        </Link>
        , fill the few required fields, then print. Also walk{" "}
        <Link href="/flow/" className="underline">
          the paycheck flow
        </Link>{" "}
        once so the order sticks.
      </Callout>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>A short written plan beats perfect theory.</li>
          <li>Automate, then review yearly.</li>
          <li>This site is educational — not personalized financial advice.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
