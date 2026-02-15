# ShekelScope

**Israeli tax transparency tool — see where every shekel of your taxes goes, why the system is broken, and what you can do about it.**

ShekelScope is a web application that calculates your Israeli tax burden, shows exactly where your money flows through the government budget, grades each ministry on efficiency, compares Israel to OECD nations, and provides actionable steps for civic change.

## Why This Exists

Israel is a first-world economy with third-world efficiency. The average Israeli pays ~45% of their income in direct and indirect taxes, yet:

- **93%** of land is controlled by one government body
- Building permits take an average of **13 years**
- Food costs **19%** more than the EU average
- Housing is **10.6x** median income (OECD average: 6.4x)
- Government efficiency scores **79/100** vs OECD average of **88/100**

This tool makes the invisible visible. Every shekel. Every ministry. Every inefficiency.

## Features

- **Tax Calculator** — Income tax, national insurance, health tax, VAT, employer costs, and tax credits for 2025
- **Interactive Dashboard** — Sankey flow diagram, donut chart, treemap, daily tax receipt, OECD comparisons
- **Efficiency Scorecard** — A-F grades for each budget category with overhead analysis
- **Why So Expensive?** — Deep dives into housing, cost of living, healthcare, education, immigration, and more
- **Take Action** — 5-level civic action plan from mindset shift to voting
- **Bilingual** — Full English and Hebrew with RTL support

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Visualization | Recharts, D3-Sankey |
| State | Zustand (with localStorage persistence) |
| Forms | React Hook Form + Zod validation |
| Animation | Framer Motion |
| i18n | next-intl (EN + HE, RTL support) |
| Testing | Vitest + Testing Library (unit), Playwright (E2E) |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Install & Run

```bash
# Clone
git clone https://github.com/naorbrown/shekelscope.git
cd shekelscope

# Install dependencies
pnpm install

# Development server
pnpm dev

# Open http://localhost:3000
```

### Scripts

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run unit/integration tests
pnpm test:watch   # Run tests in watch mode
pnpm test:e2e     # Run Playwright E2E tests
pnpm type-check   # TypeScript type checking
```

## Architecture

```
src/
├── app/[locale]/           # Localized page routes
│   ├── page.tsx            # Calculator (home)
│   ├── dashboard/          # Visualizations
│   ├── insights/           # Efficiency analysis
│   ├── why/                # Educational content
│   └── action/             # Civic action guide
├── components/
│   ├── calculator/         # Tax form, results, breakdown
│   ├── dashboard/          # Charts (sankey, donut, treemap, OECD)
│   ├── insights/           # Cost analysis cards
│   ├── why/                # Topic accordion sections
│   ├── action/             # Action level timeline
│   ├── layout/             # Header, Footer
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── tax-engine/         # Pure calculation functions
│   │   ├── income-tax.ts   # Progressive bracket calculation
│   │   ├── national-insurance.ts
│   │   ├── health-tax.ts
│   │   ├── tax-credits.ts  # Credit points system
│   │   ├── vat.ts
│   │   ├── employer-costs.ts
│   │   └── total.ts        # Orchestrator
│   ├── data/               # JSON rate files (2025)
│   ├── i18n/               # Locale routing & config
│   └── store/              # Zustand calculator state
├── messages/
│   ├── en.json             # English translations
│   └── he.json             # Hebrew translations
└── middleware.ts            # i18n routing middleware
```

### Tax Engine Pipeline

```
Profile (income, type, gender, children)
  → Tax Credits (resident + child credits)
  → Income Tax (7 brackets + surtax - credits)
  → National Insurance (reduced/full rate tiers)
  → Health Tax (reduced/full rate tiers)
  → VAT (estimated from net spending)
  → Employer Costs (NI + pension)
  → Budget Allocation (proportional to tax paid)
```

## Data Sources

All tax rates and comparative data are sourced from official government and international institutions:

| Source | What | Link |
|---|---|---|
| Israeli Tax Authority | Income tax brackets, surtax | [gov.il](https://www.gov.il/en/departments/israel-tax-authority) |
| National Insurance Institute | NI rates, thresholds | [btl.gov.il](https://www.btl.gov.il/English/) |
| Ministry of Finance | Budget allocations | [mof.gov.il](https://mof.gov.il/en/) |
| OECD | Tax burden, housing, healthcare, education | [data.oecd.org](https://data.oecd.org/israel.htm) |
| Central Bureau of Statistics | Prices, wages, demographics | [cbs.gov.il](https://www.cbs.gov.il/en/) |
| Bank of Israel | Economic data, housing reports | [boi.org.il](https://www.boi.org.il/en/) |
| State Comptroller | Government efficiency reports | [mevaker.gov.il](https://www.mevaker.gov.il/En/) |
| Taub Center | Social policy research | [taubcenter.org.il](https://www.taubcenter.org.il/en/) |
| Transparency International | Corruption perception index | [transparency.org](https://www.transparency.org/en/countries/israel) |
| World Bank | Governance indicators | [worldbank.org](https://data.worldbank.org/country/israel) |

## Testing

### Unit & Integration Tests (Vitest)

76 tests covering the tax engine, data integrity, and efficiency analyzer:

```bash
pnpm test
```

### E2E Tests (Playwright)

Full user journey tests across calculator, dashboard, navigation, content pages, and i18n:

```bash
pnpm test:e2e
```

## Internationalization

- **Locales**: English (`en`), Hebrew (`he`)
- **RTL**: Automatically applied for Hebrew via middleware
- **Prefix**: English routes have no prefix, Hebrew uses `/he`
- **Translations**: `src/messages/en.json` and `src/messages/he.json`

To add a new language:
1. Add locale to `src/lib/i18n/routing.ts`
2. Create `src/messages/<locale>.json`
3. Update middleware matcher in `src/middleware.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make changes and add tests
4. Ensure `pnpm test`, `pnpm lint`, and `pnpm build` pass
5. Commit with a descriptive message
6. Open a pull request

### Updating Tax Rates

Tax data for each year lives in `src/lib/data/`. To update for a new tax year:
1. Create new rate files (e.g., `tax-rates-2026.json`)
2. Update imports in `src/lib/tax-engine/` modules
3. Update tests to reflect new rates

## License

MIT
