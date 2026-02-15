import type { BudgetAllocationResult } from '@/lib/tax-engine/types';
import type { CategoryAnalysis } from '@/lib/data/types';
import costAnalysisData from '@/lib/data/cost-analysis.json';

export interface EfficiencyResult {
  categoryId: string;
  yourContribution: number;
  estimatedOverhead: number;
  reachesService: number;
  alternativeCost: number;
  potentialSavings: number;
  grade: string;
}

const categoryMap = new Map<string, CategoryAnalysis>(
  costAnalysisData.categories.map((c) => [c.id, c])
);

/**
 * For each budget allocation, compute how much of the taxpayer's contribution
 * is lost to overhead, how much actually reaches the intended service, and
 * how much a competitive-market alternative would cost.
 */
export function analyzeEfficiency(
  budgetAllocations: BudgetAllocationResult[]
): EfficiencyResult[] {
  return budgetAllocations.map((allocation) => {
    const analysis = categoryMap.get(allocation.id);

    if (!analysis) {
      return {
        categoryId: allocation.id,
        yourContribution: allocation.amount,
        estimatedOverhead: 0,
        reachesService: allocation.amount,
        alternativeCost: allocation.amount,
        potentialSavings: 0,
        grade: 'N/A',
      };
    }

    const overheadFraction = analysis.overheadPercent / 100;
    const estimatedOverhead = allocation.amount * overheadFraction;
    const reachesService = allocation.amount - estimatedOverhead;
    const alternativeCost = allocation.amount * analysis.alternativeCostMultiplier;
    const potentialSavings = allocation.amount - alternativeCost;

    return {
      categoryId: allocation.id,
      yourContribution: allocation.amount,
      estimatedOverhead: Math.round(estimatedOverhead),
      reachesService: Math.round(reachesService),
      alternativeCost: Math.round(alternativeCost),
      potentialSavings: Math.round(potentialSavings),
      grade: analysis.grade,
    };
  });
}

/**
 * Sum total estimated overhead across all categories.
 */
export function calculateTotalOverhead(results: EfficiencyResult[]): number {
  return results.reduce((sum, r) => sum + r.estimatedOverhead, 0);
}

/**
 * Sum total potential savings across all categories.
 */
export function calculateTotalSavings(results: EfficiencyResult[]): number {
  return results.reduce((sum, r) => sum + r.potentialSavings, 0);
}
