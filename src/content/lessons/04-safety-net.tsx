import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";

export function Lesson04() {
  return (
    <LessonShell slug="04-safety-net" goal="size an emergency fund and park it in the right kind of cash.">
      <H2>1. Why cash exists</H2>
      <p>
        An emergency fund is money for job loss, medical bills, or sudden moves — not for market timing. Without it,
        people sell investments at the worst time or put emergencies on high-rate credit cards.
      </p>
      <H2>2. How much</H2>
      <p>
        Common teaching range: 3–6 months of essential expenses. Lean toward ~6 months if your job, visa, or industry
        is less stable. Many people keep a small starter fund ($1,000–$2,000) before attacking high-rate debt, so one
        surprise bill doesn&apos;t go on a credit card.
      </p>
      <Callout variant="visa">
        International grads often prefer the higher end. OPT endings, H-1B timing, and relocation costs can arrive
        faster than a typical domestic career path.
      </Callout>
      <H2>3. Where to keep it</H2>
      <p>
        High-yield savings accounts (HYSA) are the default teaching choice: liquid, FDIC-insured at member banks, and
        they earn more than a basic checking account. FDIC insurance covers up to $250,000 per depositor, per bank, per
        ownership category. Some app-based savings accounts are insured only through partner banks — check.
      </p>
      <p>
        CDs and T-bills can fit money you will not need for a known few months, but keep true emergencies liquid. T-bill
        interest is exempt from state income tax. CDs usually charge a few months of interest for early withdrawal;
        no-penalty CDs exist at slightly lower rates.
      </p>
      <Callout variant="example">
        If essentials cost $3,000/month, a 6-month fund is about $18,000. Build it after capturing any free employer
        match and after crushing very high-interest debt (aside from a small starter cushion).
      </Callout>
      <H2>4. Order reminder</H2>
      <p>
        Cash is not the first dollar forever. Free match usually comes first; then high-rate debt; then the emergency
        fund; then long-term investing. The Account picker tool walks that order.
      </p>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>3–6 months of essentials; ~6 if your path is uncertain.</li>
          <li>HYSA for liquid emergencies; confirm FDIC coverage.</li>
          <li>Cash after free match and high-rate debt, before aggressive investing.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
