# Money Basics

Free beginner lessons and calculators for new grads and international students learning US personal finance.

**Live:** https://rishithanandyalaoff-maker.github.io/R-MAKER/

Educational only — not financial, tax, legal, or immigration advice.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Static export (`output: 'export'`) for GitHub Pages
- Client-side calculators; localStorage only
- Tax-year constants in `src/lib/rules/2026.ts`

## Develop

```bash
npm install
npm run dev
```

Because this repo deploys as a GitHub project site, open:

http://localhost:3000/R-MAKER/

## Scripts

- `npm run dev` — local site
- `npm run build` — static export to `out/`
- `npm test` — Vitest
- Push to `main` — GitHub Actions builds and deploys Pages
