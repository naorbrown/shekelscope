import { describe, it, expect } from 'vitest';
import { loadTaxData, loadContentData } from '@/modules/data/loader';

const data = loadTaxData(2025);
const content = loadContentData(2025);

describe('budget-2025.json integrity', () => {
  it('allocation percentages sum to 100', () => {
    const total = data.budget.allocations.reduce(
      (sum, a) => sum + a.percentage,
      0
    );
    expect(total).toBeCloseTo(100, 1);
  });

  it('all allocations have required fields', () => {
    for (const allocation of data.budget.allocations) {
      expect(allocation.id).toBeTruthy();
      expect(allocation.nameEn).toBeTruthy();
      expect(allocation.nameHe).toBeTruthy();
      expect(allocation.percentage).toBeGreaterThan(0);
      expect(allocation.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('cost-analysis.json integrity', () => {
  const budgetIds = new Set(data.budget.allocations.map((a) => a.id));
  const costAnalysisIds = new Set(data.costAnalysis.categories.map((c) => c.id));

  it('category IDs match budget-2025.json IDs', () => {
    for (const budgetId of budgetIds) {
      expect(costAnalysisIds.has(budgetId)).toBe(true);
    }
    for (const costId of costAnalysisIds) {
      expect(budgetIds.has(costId)).toBe(true);
    }
  });

  it('all categories have valid overhead percentages (0-100)', () => {
    for (const category of data.costAnalysis.categories) {
      expect(category.overheadPercent).toBeGreaterThanOrEqual(0);
      expect(category.overheadPercent).toBeLessThanOrEqual(100);
    }
  });

  it('reachesServicePercent = 100 - overheadPercent', () => {
    for (const category of data.costAnalysis.categories) {
      expect(category.reachesServicePercent).toBe(
        100 - category.overheadPercent
      );
    }
  });

  it('all categories have valid grades', () => {
    const validGrades = new Set(['A', 'B', 'C', 'D', 'F']);
    for (const category of data.costAnalysis.categories) {
      expect(validGrades.has(category.grade)).toBe(true);
    }
  });

  it('alternativeCostMultiplier is between 0 and 1', () => {
    for (const category of data.costAnalysis.categories) {
      expect(category.alternativeCostMultiplier).toBeGreaterThan(0);
      expect(category.alternativeCostMultiplier).toBeLessThanOrEqual(1);
    }
  });

  it('all categories have at least one source', () => {
    for (const category of data.costAnalysis.categories) {
      expect(category.sources.length).toBeGreaterThan(0);
      for (const source of category.sources) {
        expect(source.name).toBeTruthy();
        expect(source.url).toBeTruthy();
      }
    }
  });
});

describe('budget-narratives referential integrity', () => {
  const budgetIds = new Set(data.budget.allocations.map((a) => a.id));
  const narrativeIds = new Set(Object.keys(content.budgetNarratives.categories));

  it('narrative category keys are a subset of budget allocation IDs', () => {
    for (const narrativeId of narrativeIds) {
      expect(budgetIds.has(narrativeId)).toBe(true);
    }
  });
});

describe('arnona city ID uniqueness', () => {
  it('all city IDs are unique', () => {
    const ids = data.arnonaRates.cities.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
