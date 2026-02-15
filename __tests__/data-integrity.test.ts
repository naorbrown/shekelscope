import { describe, it, expect } from 'vitest';
import budgetData from '@/lib/data/budget-2025.json';
import costAnalysisData from '@/lib/data/cost-analysis.json';
import oecdData from '@/lib/data/oecd-comparison.json';

describe('budget-2025.json integrity', () => {
  it('allocation percentages sum to 100', () => {
    const total = budgetData.allocations.reduce(
      (sum, a) => sum + a.percentage,
      0
    );
    expect(total).toBeCloseTo(100, 1);
  });

  it('all allocations have required fields', () => {
    for (const allocation of budgetData.allocations) {
      expect(allocation.id).toBeTruthy();
      expect(allocation.nameEn).toBeTruthy();
      expect(allocation.nameHe).toBeTruthy();
      expect(allocation.percentage).toBeGreaterThan(0);
      expect(allocation.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('cost-analysis.json integrity', () => {
  const budgetIds = new Set(budgetData.allocations.map((a) => a.id));
  const costAnalysisIds = new Set(costAnalysisData.categories.map((c) => c.id));

  it('category IDs match budget-2025.json IDs', () => {
    // Every budget category should have a cost analysis entry
    for (const budgetId of budgetIds) {
      expect(costAnalysisIds.has(budgetId)).toBe(true);
    }

    // Every cost analysis entry should correspond to a budget category
    for (const costId of costAnalysisIds) {
      expect(budgetIds.has(costId)).toBe(true);
    }
  });

  it('all categories have valid overhead percentages (0-100)', () => {
    for (const category of costAnalysisData.categories) {
      expect(category.overheadPercent).toBeGreaterThanOrEqual(0);
      expect(category.overheadPercent).toBeLessThanOrEqual(100);
    }
  });

  it('reachesServicePercent = 100 - overheadPercent', () => {
    for (const category of costAnalysisData.categories) {
      expect(category.reachesServicePercent).toBe(
        100 - category.overheadPercent
      );
    }
  });

  it('all categories have valid grades', () => {
    const validGrades = new Set(['A', 'B', 'C', 'D', 'F']);
    for (const category of costAnalysisData.categories) {
      expect(validGrades.has(category.grade)).toBe(true);
    }
  });

  it('alternativeCostMultiplier is between 0 and 1', () => {
    for (const category of costAnalysisData.categories) {
      expect(category.alternativeCostMultiplier).toBeGreaterThan(0);
      expect(category.alternativeCostMultiplier).toBeLessThanOrEqual(1);
    }
  });

  it('all categories have at least one source', () => {
    for (const category of costAnalysisData.categories) {
      expect(category.sources.length).toBeGreaterThan(0);
      for (const source of category.sources) {
        expect(source.name).toBeTruthy();
        expect(source.url).toBeTruthy();
      }
    }
  });
});

describe('oecd-comparison.json integrity', () => {
  it('has Israel entry in taxToGDP countries', () => {
    const israelEntry = oecdData.taxToGDP.countries.find(
      (c) => c.country === 'Israel'
    );
    expect(israelEntry).toBeDefined();
    expect(israelEntry!.percentage).toBe(oecdData.taxToGDP.israel);
  });

  it('has Israel entry in housing affordability', () => {
    const israelEntry = oecdData.housingAffordability.countries.find(
      (c) => c.country === 'Israel'
    );
    expect(israelEntry).toBeDefined();
    expect(israelEntry!.priceToIncomeRatio).toBe(
      oecdData.housingAffordability.israel
    );
  });

  it('has Israel entry in healthcare spending', () => {
    const israelEntry = oecdData.healthcareSpendingPerCapita.countries.find(
      (c) => c.country === 'Israel'
    );
    expect(israelEntry).toBeDefined();
    expect(israelEntry!.spendingPerCapitaUSD).toBe(
      oecdData.healthcareSpendingPerCapita.israel
    );
  });

  it('has Israel data in education spending', () => {
    expect(oecdData.educationSpending.spendingPerStudentUSD.israel).toBe(9400);
    expect(oecdData.educationSpending.pisaScores.israel).toBe(470);
  });

  it('has Israel data in government efficiency', () => {
    expect(oecdData.governmentEfficiency.israel).toBe(79);
  });

  it('has sourceUrl and lastUpdated at root', () => {
    expect(oecdData.sourceUrl).toBeTruthy();
    expect(oecdData.lastUpdated).toBeTruthy();
  });
});
