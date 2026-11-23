import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";

export function Lesson10() {
  return (
    <LessonShell slug="10-protection" goal="cover the basics that keep a money plan from blowing up.">
      <H2>1. Health insurance</H2>
      <p>
        Employer plans usually beat going bare. Know your deductible, out-of-pocket max, and whether you have an HSA
        option (HSA eligibility has rules — confirm before contributing).
      </p>
      <H2>2. Other insurance worth knowing</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Renters insurance — cheap protection for belongings and liability.</li>
        <li>Disability insurance — protects your income if you cannot work.</li>
        <li>Life insurance — mainly if someone depends on your income.</li>
      </ul>
      <H2>3. Beneficiaries</H2>
      <p>
        Retirement accounts and life insurance pay to the beneficiary you name — not automatically to a will. Update
        names when life changes.
      </p>
      <H2>4. Basic legal docs</H2>
      <p>
        As finances grow: a will, powers of attorney, and (later) more estate planning. Early-career priority is usually
        insurance + beneficiaries + a simple will if you have dependents or meaningful assets.
      </p>
      <Callout variant="watch">
        This is not legal advice. Use it as a checklist of topics to raise with HR and, when needed, a lawyer.
      </Callout>
      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>Insurance protects the plan; investing grows it.</li>
          <li>Name beneficiaries on accounts.</li>
          <li>Add legal docs as complexity grows.</li>
        </ul>
      </Callout>
    </LessonShell>
  );
}
