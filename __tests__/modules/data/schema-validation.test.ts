import { describe, it, expect } from 'vitest';
import { loadTaxData, loadContentData, loadAndValidate } from '@/modules/data/loader';
import { TaxRatesSchema } from '@/modules/data/schemas/tax-rates.schema';
import { BudgetSchema } from '@/modules/data/schemas/budget.schema';

describe('loadTaxData', () => {
  it('loads and validates 2025 tax data without errors', () => {
    const data = loadTaxData(2025);
    expect(data.taxRates.taxYear).toBe(2025);
    expect(data.taxRates.incomeTaxBrackets.length).toBeGreaterThan(0);
    expect(data.nationalInsurance.averageWageMonthly).toBeGreaterThan(0);
    expect(data.taxCredits.pointValueAnnual).toBe(2904);
    expect(data.vatRates.currentRate).toBe(0.18);
    expect(data.budget.allocations.length).toBeGreaterThan(0);
    expect(data.arnonaRates.cities.length).toBeGreaterThan(0);
    expect(data.costAnalysis.categories.length).toBeGreaterThan(0);
  });

  it('throws for unsupported year', () => {
    expect(() => loadTaxData(2024)).toThrow('No tax data available for year 2024');
  });

  it('caches subsequent calls', () => {
    const first = loadTaxData(2025);
    const second = loadTaxData(2025);
    expect(first).toBe(second); // Same reference
  });
});

describe('loadContentData', () => {
  it('loads and validates 2025 content data without errors', () => {
    const data = loadContentData(2025);
    expect(data.budgetNarratives.categories).toBeDefined();
    expect(data.actionResources.levels.length).toBeGreaterThan(0);
    expect(data.civicPlatforms.platforms.length).toBeGreaterThan(0);
  });

  it('throws for unsupported year', () => {
    expect(() => loadContentData(2024)).toThrow('No content data available for year 2024');
  });
});

describe('loadAndValidate rejects invalid data', () => {
  it('rejects tax rates with missing brackets', () => {
    expect(() =>
      loadAndValidate(TaxRatesSchema, { taxYear: 2025 }, 'test')
    ).toThrow('Data validation failed');
  });

  it('rejects budget with percentages not summing to 100', () => {
    const badBudget = {
      taxYear: 2025,
      lastUpdated: '2025-01-01',
      sourceUrl: 'https://example.com',
      totalBudgetBillionNIS: 607,
      totalTaxRevenueBillionNIS: 420,
      allocations: [
        { id: 'test', nameEn: 'Test', nameHe: 'Test', percentage: 50, color: '#000000' },
      ],
    };
    expect(() =>
      loadAndValidate(BudgetSchema, badBudget, 'test')
    ).toThrow();
  });
});
