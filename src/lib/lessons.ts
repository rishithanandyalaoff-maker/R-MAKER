export type LessonMeta = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  visaOnly?: boolean;
};

export const LESSONS: LessonMeta[] = [
  { slug: "01-why-start-now", number: 1, title: "Why start now", summary: "Savings rate, compounding, and your independence number." },
  { slug: "02-your-paycheck", number: 2, title: "Your paycheck, decoded", summary: "Gross to take-home, brackets, and FICA." },
  { slug: "03-budget", number: 3, title: "Budget and pay yourself first", summary: "Fixed vs variable costs and savings rate." },
  { slug: "04-safety-net", number: 4, title: "Your safety net", summary: "Emergency funds, HYSA, CDs, and T-bills." },
  { slug: "05-debt", number: 5, title: "Debt", summary: "When to pay aggressively vs invest; refinance basics." },
  { slug: "06-retirement-accounts", number: 6, title: "The four retirement accounts", summary: "401(k) vs IRA, traditional vs Roth." },
  { slug: "07-getting-money-out", number: 7, title: "Getting your money out", summary: "59½, Roth ordering, and why brokerage is flexible." },
  { slug: "08-what-to-invest-in", number: 8, title: "What to invest in", summary: "Index funds, allocation, and simple rules of thumb." },
  {
    slug: "09-visa-and-cross-border",
    number: 9,
    title: "Visa and cross-border money",
    summary: "For international students; skip if not applicable.",
    visaOnly: true,
  },
  { slug: "10-protection", number: 10, title: "Protection", summary: "Insurance, beneficiaries, and basic legal docs." },
  { slug: "11-build-your-plan", number: 11, title: "Build your plan", summary: "Connect lessons to the Plan Builder and checklists." },
];
