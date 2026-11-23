import { Callout } from "@/components/callout";
import { H2, LessonShell } from "@/components/lessons/lesson-shell";
import { LessonQuiz } from "@/components/lessons/lesson-quiz";

export function Lesson09() {
  return (
    <LessonShell
      slug="09-visa-and-cross-border"
      goal="Handle taxes, accounts and big decisions as an F-1, OPT or H-1B worker — including if you leave the US."
    >
      <H2>1. Who this lesson is for</H2>
      <p>
        Skip if you are a US citizen or green-card holder with no foreign accounts. Read it if you are on F-1, OPT, STEM
        OPT, H-1B or a similar status, or if you might move abroad.
      </p>

      <H2>2. Your tax status as a student</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Most F-1 students are &quot;exempt individuals&quot; for their first 5 calendar years in the US. During those
          years you are usually a <strong>nonresident alien</strong> for tax, even while working on OPT.
        </li>
        <li>
          Nonresidents file <strong>Form 1040-NR</strong>, not the regular 1040. Most consumer tax software does not
          support it; tools such as Sprintax do, and many schools offer free access.
        </li>
        <li>
          <strong>Tax treaties</strong> can lower your tax. Example: under the US–India treaty, Indian students can
          usually claim the standard deduction, which most nonresidents cannot. Look up your country&apos;s treaty in IRS
          Publication 901.
        </li>
        <li>Your state may treat you differently from the federal rules. Check your state&apos;s instructions.</li>
      </ul>
      <Callout variant="example">
        Internship + signing-bonus years often produce a refund. Payroll withholds as if your salary lasts all year, and
        bonuses are withheld at a flat 22%. A student who earned $75,000 in a partial year may get several thousand
        dollars back.
      </Callout>

      <H2>3. Social Security and Medicare (FICA)</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          While you are a nonresident on F-1 or OPT, you are generally <strong>exempt from Social Security and Medicare
          (7.65%)</strong>.
        </li>
        <li>
          Tell payroll your status in your first week. If FICA was withheld by mistake, ask your employer for a refund
          first; if they cannot, file Form 843 with Form 8316.
        </li>
        <li>
          The exemption ends when you change to H-1B (or become a tax resident). Take-home drops by about 7.65% overnight
          — plan for it.
        </li>
        <li>
          Social Security benefits generally require about 10 years of US work. The US has &quot;totalization
          agreements&quot; with some countries that let work count in both; it has none with India.
        </li>
      </ul>

      <H2>4. The H-1B timeline</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Registration lottery: March. Results: late March.</li>
        <li>
          A first-time (&quot;cap&quot;) H-1B starts <strong>October 1 at the earliest</strong>, even if approved in
          spring.
        </li>
        <li>&quot;Cap-gap&quot; lets F-1/OPT workers keep working until October 1 if the petition was filed on time.</li>
        <li>
          Your first H-1B year is often <strong>dual-status</strong> for tax (nonresident part of the year, resident the
          rest), with special elections. Use a tax preparer for that year.
        </li>
        <li>
          Job loss: H-1B workers generally have a grace period of up to 60 days; OPT allows a limited number of
          unemployment days (90, or 150 total with STEM OPT). This is why a 6-month emergency fund matters.
        </li>
      </ul>

      <H2>5. Once you are a US tax resident</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          The US taxes your <strong>worldwide income</strong>, including interest earned in your home country.
        </li>
        <li>
          File an <strong>FBAR</strong> (FinCEN Form 114) if your foreign accounts total more than $10,000 at any point
          in the year. Larger balances may also need Form 8938.
        </li>
        <li>
          Avoid holding home-country mutual funds or ETFs. US &quot;PFIC&quot; rules tax them harshly and require complex
          filings. Home-country bank deposits are simpler.
        </li>
        <li>
          Decide what to do with savings back home: keep them as a family or safety fund, or move them to the US to
          invest.
        </li>
      </ul>

      <H2>6. Building credit and banking</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          You may not have a credit history at first. Options: a student or secured credit card, or becoming an
          authorized user on a trusted person&apos;s card.
        </li>
        <li>
          Pay every card in full each month. A year of history makes renting and loan refinancing easier and cheaper.
        </li>
        <li>
          Many lenders (including for refinancing) require H-1B or a green card, or a US citizen/green-card cosigner.
        </li>
        <li>Keep cash for deposits, first and last month&apos;s rent, and a flight home.</li>
      </ul>

      <H2>7. If you might leave the US within ~5 years (short-horizon path)</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Still take any free employer match — but check the vesting schedule.</li>
        <li>Keep more in cash and a brokerage account, and less in accounts locked until 59½.</li>
        <li>Use a safer investment mix for money you will need when you move.</li>
        <li>Pay down US debt before leaving; repaying a US loan from abroad is harder.</li>
        <li>
          Staying on OPT (if your plans are firm) keeps the FICA exemption; switching to H-1B only to refinance a loan
          can cost more in FICA than it saves in interest. Run the refinance sketch in Lesson 5 with your own numbers.
        </li>
      </ul>

      <H2>8. If you leave the US</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>You do not have to cash out.</strong> 401(k)s and IRAs can stay invested. Use a brokerage that supports
          non-US residents, and keep one US bank account.
        </li>
        <li>The 10% early-withdrawal penalty depends on your age, not where you live.</li>
        <li>
          The US still taxes withdrawals from US retirement accounts (often with 30% withholding for nonresidents, which
          a treaty may reduce). Your new country may tax them too, usually with a credit for US tax.
        </li>
        <li>
          Many countries, including India, do not treat Roth accounts as tax-free. Holding both traditional and Roth
          money spreads this risk.
        </li>
        <li>
          Returning Indian residents often qualify for 2–3 years of <strong>RNOR</strong> status (resident but not
          ordinarily resident), during which India generally does not tax foreign income. That window can be a good time
          to sell or withdraw.
        </li>
        <li>
          Nonresidents who own more than $60,000 of US assets (including US stocks and retirement accounts) can face US
          estate tax at death. Keep a will and named beneficiaries.
        </li>
      </ul>

      <Callout variant="visa">
        Rules differ by country, treaty and personal history. Before filing, changing status, or withdrawing money across
        borders, talk to your school&apos;s international office and a tax professional who handles cross-border cases.
      </Callout>

      <Callout variant="takeaways">
        <ul className="list-disc space-y-1 pl-5">
          <li>F-1/OPT years: usually nonresident, 1040-NR, no FICA — and often a refund.</li>
          <li>H-1B starts October 1 at the earliest and adds FICA.</li>
          <li>Leaving the US does not force cashing out; plan withdrawals around your new country&apos;s taxes.</li>
          <li>Short stay? Keep money flexible after capturing free match.</li>
        </ul>
      </Callout>

      <LessonQuiz
        lessonId="09-visa-and-cross-border"
        questions={[
          {
            id: "q1",
            prompt: "On F-1 OPT in your second year in the US, do you usually pay Social Security and Medicare?",
            choices: [
              "Yes — all workers pay FICA",
              "No (exempt as a nonresident)",
              "Only if you earn over $100,000",
            ],
            answer: 1,
            explanation: "While you are a nonresident on F-1 or OPT, you are generally exempt from FICA (7.65%).",
          },
          {
            id: "q2",
            prompt: "Your H-1B was approved in May. When can it start?",
            choices: ["Immediately", "October 1 at the earliest", "January 1 of the next year"],
            answer: 1,
            explanation: "A first-time (cap) H-1B starts October 1 at the earliest, even if approved in spring.",
          },
          {
            id: "q3",
            prompt: "You move home at 34. Must you cash out your 401(k)?",
            choices: [
              "Yes — nonresidents cannot keep US retirement accounts",
              "No; it can stay invested, and the 10% penalty depends on age, not location",
              "Only if the balance is over $60,000",
            ],
            answer: 1,
            explanation:
              "You do not have to cash out. Accounts can stay invested; the early-withdrawal penalty depends on age.",
          },
        ]}
      />
    </LessonShell>
  );
}
