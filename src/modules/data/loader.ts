import { z } from 'zod/v4';
import { TaxRatesSchema, type TaxRatesData } from './schemas/tax-rates.schema';
import { NationalInsuranceSchema, type NationalInsuranceData } from './schemas/national-insurance.schema';
import { TaxCreditsSchema, type TaxCreditsData } from './schemas/tax-credits.schema';
import { VatRatesSchema, type VatRatesData } from './schemas/vat-rates.schema';
import { BudgetSchema, type BudgetData } from './schemas/budget.schema';
import { ArnonaRatesSchema, type ArnonaRatesData } from './schemas/arnona-rates.schema';
import { CostAnalysisSchema, type CostAnalysisData } from './schemas/cost-analysis.schema';
import { BudgetNarrativesSchema, type BudgetNarrativesData } from './schemas/budget-narratives.schema';
import { ActionResourcesSchema, type ActionResourcesData } from './schemas/action-resources.schema';
import { CivicPlatformsSchema, type CivicPlatformsData } from './schemas/civic-platforms.schema';

// JSON imports — this is the ONLY file in the codebase that imports JSON directly
import taxRates2025 from './sources/tax-rates-2025.json';
import niRates2025 from './sources/national-insurance-2025.json';
import taxCredits2025 from './sources/tax-credits-2025.json';
import vatRates from './sources/vat-rates.json';
import budget2025 from './sources/budget-2025.json';
import arnonaRates from './sources/arnona-rates.json';
import costAnalysis from './sources/cost-analysis.json';
import budgetNarratives from './sources/budget-narratives.json';
import actionResources from './sources/action-resources.json';
import civicPlatforms from './sources/civic-platforms.json';

/**
 * Parse data through a Zod schema. Throws on invalid data with a descriptive error.
 */
export function loadAndValidate<T extends z.ZodType>(
  schema: T,
  data: unknown,
  label: string
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = z.prettifyError(result.error);
    throw new Error(`Data validation failed for "${label}":\n${issues}`);
  }
  return result.data;
}

/**
 * Bundle of all tax-related data needed for a calculation.
 * Passed as a parameter to calculateTotalTax — no hidden dependencies.
 */
export interface TaxDataBundle {
  taxRates: TaxRatesData;
  nationalInsurance: NationalInsuranceData;
  taxCredits: TaxCreditsData;
  vatRates: VatRatesData;
  budget: BudgetData;
  arnonaRates: ArnonaRatesData;
  costAnalysis: CostAnalysisData;
}

/**
 * Bundle of all content/narrative data.
 * Separate from TaxDataBundle because it's used by UI, not the engine.
 */
export interface ContentDataBundle {
  budgetNarratives: BudgetNarrativesData;
  actionResources: ActionResourcesData;
  civicPlatforms: CivicPlatformsData;
}

// Caches — validated once, reused forever
const taxBundles = new Map<number, TaxDataBundle>();
const contentBundles = new Map<number, ContentDataBundle>();

/**
 * Load and validate all tax data for a given year.
 * Cached after first call.
 */
export function loadTaxData(year: number): TaxDataBundle {
  if (taxBundles.has(year)) return taxBundles.get(year)!;

  if (year === 2025) {
    const bundle: TaxDataBundle = {
      taxRates: loadAndValidate(TaxRatesSchema, taxRates2025, 'tax-rates-2025'),
      nationalInsurance: loadAndValidate(NationalInsuranceSchema, niRates2025, 'national-insurance-2025'),
      taxCredits: loadAndValidate(TaxCreditsSchema, taxCredits2025, 'tax-credits-2025'),
      vatRates: loadAndValidate(VatRatesSchema, vatRates, 'vat-rates'),
      budget: loadAndValidate(BudgetSchema, budget2025, 'budget-2025'),
      arnonaRates: loadAndValidate(ArnonaRatesSchema, arnonaRates, 'arnona-rates'),
      costAnalysis: loadAndValidate(CostAnalysisSchema, costAnalysis, 'cost-analysis'),
    };
    taxBundles.set(year, bundle);
    return bundle;
  }

  throw new Error(`No tax data available for year ${year}`);
}

/**
 * Load and validate all content/narrative data for a given year.
 * Cached after first call.
 */
export function loadContentData(year: number): ContentDataBundle {
  if (contentBundles.has(year)) return contentBundles.get(year)!;

  if (year === 2025) {
    const bundle: ContentDataBundle = {
      budgetNarratives: loadAndValidate(BudgetNarrativesSchema, budgetNarratives, 'budget-narratives'),
      actionResources: loadAndValidate(ActionResourcesSchema, actionResources, 'action-resources'),
      civicPlatforms: loadAndValidate(CivicPlatformsSchema, civicPlatforms, 'civic-platforms'),
    };
    contentBundles.set(year, bundle);
    return bundle;
  }

  throw new Error(`No content data available for year ${year}`);
}
