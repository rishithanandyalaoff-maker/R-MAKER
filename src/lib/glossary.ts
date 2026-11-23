export type GlossaryTerm = {
  id: string;
  term: string;
  short: string;
  definition: string;
  aliases?: string[];
};

export const GLOSSARY: GlossaryTerm[] = [
  { id: "gross-pay", term: "Gross pay", short: "Pay before deductions", definition: "Your salary or wages before taxes, health premiums, or retirement contributions are taken out." },
  { id: "take-home", term: "Take-home pay", short: "What hits your bank", definition: "Money left after taxes and paycheck deductions. Also called net pay." },
  { id: "marginal-rate", term: "Marginal tax rate", short: "Tax on your next dollar", definition: "The tax rate that applies to your next dollar of taxable income. It is not the rate you pay on every dollar." },
  { id: "effective-rate", term: "Effective tax rate", short: "Average tax rate", definition: "Total tax divided by income. Usually lower than your marginal rate because only the top slice is taxed at the top bracket." },
  { id: "standard-deduction", term: "Standard deduction", short: "Automatic tax reduction", definition: "A fixed dollar amount you subtract from income before figuring federal tax, if you do not itemize deductions." },
  { id: "tax-bracket", term: "Tax bracket", short: "Rate band for income", definition: "A range of taxable income taxed at one federal rate. Higher income fills higher brackets; lower brackets still apply to earlier dollars." },
  { id: "fica", term: "FICA", short: "Social Security + Medicare", definition: "Payroll taxes for Social Security and Medicare. Often shown separately from federal income tax." },
  { id: "social-security", term: "Social Security tax", short: "6.2% up to a wage base", definition: "Employee Social Security tax is a percent of wages up to an annual wage base. Some F-1/OPT nonresidents are exempt." },
  { id: "medicare", term: "Medicare tax", short: "1.45% (+ extra at high income)", definition: "Employee Medicare tax is usually 1.45% of wages, with an extra 0.9% above a high-income threshold." },
  { id: "401k", term: "401(k)", short: "Workplace retirement account", definition: "A retirement plan opened through your employer. Money can go in before tax (traditional) or after tax (Roth), up to an annual employee limit." },
  { id: "ira", term: "IRA", short: "Individual retirement account", definition: "A retirement account you open yourself at a brokerage. Separate yearly limit from a 401(k)." },
  { id: "roth", term: "Roth", short: "Taxed now, tax-free later", definition: "Contributions are after-tax. Qualified withdrawals of growth later can be tax-free. Useful when your tax rate today is low." },
  { id: "traditional", term: "Traditional", short: "Tax break now, taxed later", definition: "Contributions may reduce taxable income now. Withdrawals in retirement are generally taxed as ordinary income." },
  { id: "backdoor-roth", term: "Backdoor Roth", short: "Roth path when income is high", definition: "Contribute to a traditional IRA (nondeductible) then convert to Roth. Works cleanly if your traditional IRA balance stays near $0 (pro-rata rule)." },
  { id: "pro-rata-rule", term: "Pro-rata rule", short: "Taxes conversions by mix", definition: "If you have pretax traditional IRA money, Roth conversions are taxed in proportion to pretax vs after-tax IRA balances." },
  { id: "match", term: "Employer match", short: "Free money if you contribute", definition: "Your employer adds money only if you contribute enough. Contribute at least enough to get the full match." },
  { id: "employer-contribution", term: "Automatic employer contribution", short: "Free money even if you put in $0", definition: "Some employers contribute a percent of pay without requiring you to contribute. Confirm with HR — it is not always a match." },
  { id: "vesting", term: "Vesting", short: "When employer money is yours", definition: "A schedule for when employer contributions become fully yours if you leave the company." },
  { id: "hsa", term: "HSA", short: "Health savings account", definition: "A triple-tax-advantaged account paired with certain high-deductible health plans. Can be invested and used for qualified medical costs." },
  { id: "etf", term: "ETF", short: "Exchange-traded fund", definition: "A fund that trades like a stock and usually holds a basket of investments, often tracking an index." },
  { id: "index-fund", term: "Index fund", short: "Owns the market basket", definition: "A fund built to track a market index (for example, the total US stock market) instead of picking winners." },
  { id: "expense-ratio", term: "Expense ratio", short: "Annual fund fee", definition: "The yearly fee a fund charges as a percent of assets. Lower is usually better for the same kind of fund." },
  { id: "asset-allocation", term: "Asset allocation", short: "Mix of stocks, bonds, cash", definition: "How you split money across investment types. Time horizon and risk comfort guide the mix." },
  { id: "rebalancing", term: "Rebalancing", short: "Resetting your mix", definition: "Buying or selling to bring your portfolio back to the target allocation after markets move." },
  { id: "dca", term: "Dollar-cost averaging", short: "Investing on a schedule", definition: "Putting money in regularly over time. Historically, lump sum often wins, but monthly investing can feel easier." },
  { id: "capital-gains", term: "Capital gains", short: "Profit from selling investments", definition: "Taxed differently depending on how long you held the investment. Holding over a year can qualify for long-term rates." },
  { id: "wash-sale", term: "Wash-sale rule", short: "Blocks some loss claims", definition: "If you sell at a loss and buy a substantially identical investment too soon, you may not deduct that loss right away. Also watch IRAs." },
  { id: "tax-loss-harvesting", term: "Tax-loss harvesting", short: "Using losses to offset gains", definition: "Selling investments at a loss to offset taxable gains, while staying mindful of the wash-sale rule." },
  { id: "apr", term: "APR", short: "Yearly interest rate", definition: "Annual percentage rate. Higher APR debt usually deserves faster payoff." },
  { id: "refinance", term: "Refinance", short: "Replace a loan with a new one", definition: "Taking a new loan, often at a lower rate, to replace an old one. Visa status can affect who will lend." },
  { id: "cosigner", term: "Cosigner", short: "Someone who shares loan responsibility", definition: "A person who promises to repay if you cannot. Some lenders ask internationals for a US citizen or green-card cosigner." },
  { id: "emergency-fund", term: "Emergency fund", short: "Cash for surprises", definition: "Money set aside for job loss or big unexpected costs. Often 3–6 months of expenses; closer to 6 on a visa." },
  { id: "hysa", term: "HYSA", short: "High-yield savings account", definition: "A savings account that pays a higher interest rate than a typical checking account. Good for emergency cash." },
  { id: "cd", term: "CD", short: "Certificate of deposit", definition: "A timed deposit that usually pays more interest if you leave money alone until maturity. Early withdrawals may cost a penalty." },
  { id: "t-bill", term: "T-bill", short: "Short-term US Treasury bill", definition: "A short-term government security. Often used for cash you need within months to a couple of years." },
  { id: "compounding", term: "Compounding", short: "Growth on growth", definition: "Earning returns on both your original money and earlier returns. Time is the main ingredient." },
  { id: "fi-number", term: "Financial independence number", short: "About 25× yearly spending", definition: "A rough savings target so investment returns could cover living costs. Example: $40,000/year spending → about $1,000,000." },
  { id: "savings-rate", term: "Savings rate", short: "Share of income you keep", definition: "How much of your income you save or invest. Early on, savings rate usually matters more than investment returns." },
  { id: "brokerage", term: "Brokerage account", short: "Flexible taxable investing", definition: "A normal investing account with no special retirement tax wrapper. Usually the most flexible place for money you may need before age 59½." },
  { id: "vested-balance", term: "Vested balance", short: "What you keep if you leave", definition: "The portion of retirement money you own outright, including your contributions and any vested employer money." },
  { id: "rollover", term: "Rollover", short: "Moving retirement money", definition: "Transferring funds from one retirement account to another, often when you change jobs. Rules matter for taxes and penalties." },
  { id: "required-minimum", term: "RMD", short: "Required minimum distribution", definition: "Forced withdrawals from some retirement accounts starting at a later age. Roth IRAs generally do not require them during the owner’s lifetime." },
  { id: "fbar", term: "FBAR", short: "Foreign account report", definition: "A US report for people with foreign financial accounts over a threshold (commonly $10,000 aggregate). Separate from your tax return." },
  { id: "pfic", term: "PFIC", short: "Foreign mutual fund tax trap", definition: "Many non-US mutual funds are PFICs for US tax residents and can create painful tax reporting. Prefer US-domiciled funds once you are a US tax resident." },
  { id: "1040-nr", term: "Form 1040-NR", short: "Nonresident tax return", definition: "The US tax return often used by nonresident aliens. Treaty benefits may apply." },
  { id: "opt", term: "OPT", short: "Optional Practical Training", definition: "Work authorization for many F-1 students after study. Timing and FICA rules can differ from H-1B." },
  { id: "stem-opt", term: "STEM OPT", short: "Extra OPT years for STEM", definition: "An extension of OPT for eligible STEM degrees. Confirm details with your school’s international office." },
  { id: "cap-gap", term: "Cap-gap", short: "Bridge to H-1B start", definition: "A status bridge that can help some F-1/OPT workers stay authorized until an October H-1B start." },
  { id: "h1b", term: "H-1B", short: "Specialty-occupation work visa", definition: "A common work visa for specialty roles. Lottery timing and start dates matter for taxes and loan refinancing." },
  { id: "i797", term: "I-797", short: "USCIS approval notice", definition: "A notice from USCIS that often documents petition approvals, including H-1B approvals." },
  { id: "rnor", term: "RNOR", short: "India tax residency window", definition: "Returning Non-Resident status in India that can create a temporary tax window after returning. Confirm with a cross-border tax professional." },
  { id: "totalization", term: "Totalization agreement", short: "Social Security treaty", definition: "An agreement between countries about Social Security coverage and credits. Not every country has one with the US." },
  { id: "withholding", term: "Withholding", short: "Tax taken from pay", definition: "Money your employer sends to the tax agency from each paycheck. It is an estimate, not always your final tax bill." },
  { id: "bonus-withholding", term: "Bonus withholding", short: "Often 22% federal supplemental", definition: "Many bonuses are withheld at a flat federal supplemental rate. Your eventual tax on that bonus may differ." },
  { id: "liquidity", term: "Liquidity", short: "How fast you can use cash", definition: "How quickly you can turn an asset into spendable money without a big penalty or delay." },
  { id: "risk-tolerance", term: "Risk tolerance", short: "How much ups and downs you can handle", definition: "Your ability and willingness to see account values swing. Time horizon and job security matter." },
  { id: "time-horizon", term: "Time horizon", short: "When you need the money", definition: "How soon you will spend the money. Money needed within about two years usually stays out of stocks." },
  { id: "diversification", term: "Diversification", short: "Not one bet", definition: "Spreading investments so one company or country cannot sink your whole plan." },
  { id: "target-date-fund", term: "Target-date fund", short: "One-fund mix by year", definition: "A fund that holds a mix of stocks and bonds and usually gets more conservative as a target year approaches." },
  { id: "mega-backdoor", term: "Mega backdoor Roth", short: "After-tax 401(k) → Roth", definition: "If your plan allows after-tax 401(k) contributions and in-plan Roth conversions or rollovers, you may move more into Roth. Ask HR." },
  { id: "59-half", term: "Age 59½ rule", short: "Early withdrawal line", definition: "Many retirement withdrawals before 59½ face income tax and an extra 10% penalty, with exceptions." },
  { id: "roth-ordering", term: "Roth IRA ordering rules", short: "Contributions come out first", definition: "Roth IRA withdrawals are generally treated as contributions first, then conversions, then earnings — with different tax and timing rules." },
  { id: "beneficiary", term: "Beneficiary", short: "Who inherits an account", definition: "The person or entity named to receive an account if you die. Update these when life changes." },
  { id: "umbrella", term: "Umbrella insurance", short: "Extra liability cover", definition: "A policy that adds liability protection above auto and home/renters coverage. Often later in a plan." },
  { id: "own-occupation", term: "Own-occupation disability", short: "Pays if you cannot do your job", definition: "Disability insurance that looks at whether you can do your own occupation, not just any job." },
];

export function getTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((item) => item.id === id);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter((item) => {
    const hay = [item.term, item.short, item.definition, ...(item.aliases ?? [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
