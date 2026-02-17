import type { BudgetAllocationResult } from '../tax-engine/types';
import type { CostAnalysisData } from '../data/types';
import type { EfficiencyResult } from './types';

/**
 * For each budget allocation, compute how much of the taxpayer's contribution
 * is lost to overhead, how much actually reaches the intended service, and
 * how much a competitive-market alternative would cost.
 *
 * Cost analysis data is passed as a parameter — no hidden JSON imports.
 */
export function analyzeEfficiency(
  budgetAllocations: BudgetAllocationResult[],
  costAnalysisData?: CostAnalysisData
): EfficiencyResult[] {
  const categoryMap = costAnalysisData
    ? new Map(costAnalysisData.categories.map((c) => [c.id, c]))
    : new Map();

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
