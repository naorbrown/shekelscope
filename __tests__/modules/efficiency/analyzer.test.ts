import { describe, it, expect } from 'vitest';
import {
  analyzeEfficiency,
  calculateTotalOverhead,
  calculateTotalSavings,
} from '@/modules/efficiency/analyzer';
import { loadTaxData } from '@/modules/data/loader';
import type { BudgetAllocationResult } from '@/modules/tax-engine/types';

const data = loadTaxData(2025);

function makeMockAllocations(): BudgetAllocationResult[] {
  return [
    {
      id: 'defense',
      nameEn: 'Defense',
      nameHe: 'ביטחון',
      amount: 10000,
      percentage: 16.5,
      color: '#2D6A7A',
    },
    {
      id: 'education',
      nameEn: 'Education',
      nameHe: 'חינוך',
      amount: 8000,
      percentage: 15.2,
      color: '#6B5B8D',
    },
    {
      id: 'housing',
      nameEn: 'Housing & Construction',
      nameHe: 'שיכון ובינוי',
      amount: 5000,
      percentage: 4.5,
      color: '#8A7050',
    },
    {
      id: 'transportation',
      nameEn: 'Transportation',
      nameHe: 'תחבורה',
      amount: 4000,
      percentage: 6.2,
      color: '#4A8A9A',
    },
  ];
}

describe('analyzeEfficiency', () => {
  it('returns one result per allocation', () => {
    const allocations = makeMockAllocations();
    const results = analyzeEfficiency(allocations, data.costAnalysis);
    expect(results).toHaveLength(allocations.length);
  });

  it('calculates correct overhead for defense (15%)', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const defense = results.find((r) => r.categoryId === 'defense')!;

    expect(defense.yourContribution).toBe(10000);
    expect(defense.estimatedOverhead).toBe(1500);
    expect(defense.reachesService).toBe(8500);
    expect(defense.grade).toBe('B');
  });

  it('calculates correct overhead for housing (40%)', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const housing = results.find((r) => r.categoryId === 'housing')!;

    expect(housing.estimatedOverhead).toBe(2000);
    expect(housing.reachesService).toBe(3000);
    expect(housing.grade).toBe('F');
  });

  it('calculates alternative cost using multiplier', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const defense = results.find((r) => r.categoryId === 'defense')!;

    expect(defense.alternativeCost).toBe(8000);
    expect(defense.potentialSavings).toBe(2000);
  });

  it('calculates correct savings for transportation (multiplier 0.55)', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const transport = results.find((r) => r.categoryId === 'transportation')!;

    expect(transport.alternativeCost).toBe(2200);
    expect(transport.potentialSavings).toBe(1800);
    expect(transport.grade).toBe('F');
  });

  it('overhead + reaches service = your contribution', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    for (const result of results) {
      expect(result.estimatedOverhead + result.reachesService).toBe(
        result.yourContribution
      );
    }
  });

  it('handles unknown category IDs gracefully', () => {
    const unknownAllocation: BudgetAllocationResult[] = [
      {
        id: 'unknown_category',
        nameEn: 'Unknown',
        nameHe: 'לא ידוע',
        amount: 1000,
        percentage: 1.0,
        color: '#000000',
      },
    ];
    const results = analyzeEfficiency(unknownAllocation, data.costAnalysis);

    expect(results).toHaveLength(1);
    expect(results[0].estimatedOverhead).toBe(0);
    expect(results[0].reachesService).toBe(1000);
    expect(results[0].alternativeCost).toBe(1000);
    expect(results[0].potentialSavings).toBe(0);
    expect(results[0].grade).toBe('N/A');
  });

  it('handles empty allocations array', () => {
    const results = analyzeEfficiency([], data.costAnalysis);
    expect(results).toHaveLength(0);
  });
});

describe('calculateTotalOverhead', () => {
  it('sums overhead across all categories', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const totalOverhead = calculateTotalOverhead(results);
    // defense: 1500, education: 2000, housing: 2000, transportation: 1400
    expect(totalOverhead).toBe(6900);
  });

  it('returns 0 for empty results', () => {
    expect(calculateTotalOverhead([])).toBe(0);
  });
});

describe('calculateTotalSavings', () => {
  it('sums potential savings across all categories', () => {
    const results = analyzeEfficiency(makeMockAllocations(), data.costAnalysis);
    const totalSavings = calculateTotalSavings(results);
    // defense: 2000, education: 2800, housing: 2500, transportation: 1800
    expect(totalSavings).toBe(9100);
  });

  it('returns 0 for empty results', () => {
    expect(calculateTotalSavings([])).toBe(0);
  });
});
