'use client';

import type { TotalTaxResult } from '@/modules/tax-engine/types';
import type { CostAnalysisData } from '@/modules/data/types';
import type { BudgetNarrativesData } from '@/modules/data/types';
import { analyzeEfficiency } from '@/modules/efficiency';
import { getContent, CONTENT } from '@/content';
import { formatShekel } from '@/lib/utils';
import { CategoryCard } from './category-card';

interface BudgetBreakdownProps {
  result: TotalTaxResult;
  costAnalysis: CostAnalysisData;
  narratives: BudgetNarrativesData;
}

export function BudgetBreakdown({ result, costAnalysis, narratives }: BudgetBreakdownProps) {
  const efficiencyResults = analyzeEfficiency(result.budgetAllocation, costAnalysis);
  const monthlyDeductions = result.totalDeductions / 12;

  // Build the section title with the actual amount
  const titleTemplate = getContent(CONTENT.SECTION_BREAKDOWN_TITLE);
  const title = titleTemplate.replace('{amount}', formatShekel(monthlyDeductions).replace(/[^\d,]/g, ''));

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground">
          {getContent(CONTENT.SECTION_BREAKDOWN_SUBTITLE)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.budgetAllocation.map((allocation) => {
          const efficiency = efficiencyResults.find(
            (e) => e.categoryId === allocation.id
          );
          const narrative = narratives.categories[allocation.id];
          return (
            <CategoryCard
              key={allocation.id}
              allocation={allocation}
              efficiency={efficiency ?? null}
              narrative={narrative ?? null}
            />
          );
        })}
      </div>
    </section>
  );
}
