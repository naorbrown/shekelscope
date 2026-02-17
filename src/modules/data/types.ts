/**
 * Re-export all data types inferred from Zod schemas.
 * These are the canonical types — no manual interfaces needed.
 */
export type { TaxRatesData } from './schemas/tax-rates.schema';
export type { NationalInsuranceData } from './schemas/national-insurance.schema';
export type { TaxCreditsData } from './schemas/tax-credits.schema';
export type { VatRatesData } from './schemas/vat-rates.schema';
export type { BudgetData } from './schemas/budget.schema';
export type { CostAnalysisData } from './schemas/cost-analysis.schema';
export type { ArnonaRatesData } from './schemas/arnona-rates.schema';
export type { BudgetNarrativesData } from './schemas/budget-narratives.schema';
export type { ActionResourcesData } from './schemas/action-resources.schema';
export type { CivicPlatformsData } from './schemas/civic-platforms.schema';
export type { TaxDataBundle, ContentDataBundle } from './loader';
