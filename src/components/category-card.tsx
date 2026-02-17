'use client';

import { useState } from 'react';
import type { BudgetAllocationResult } from '@/modules/tax-engine/types';
import type { EfficiencyResult } from '@/modules/efficiency/types';
import type { BudgetNarrativesData } from '@/modules/data/types';
import { getContent, CONTENT } from '@/content';
import { formatShekel } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryDetail } from './category-detail';

type CategoryNarrative = BudgetNarrativesData['categories'][string];

interface CategoryCardProps {
  allocation: BudgetAllocationResult;
  efficiency: EfficiencyResult | null;
  narrative: CategoryNarrative | null;
}

const gradeColors: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-800',
  B: 'bg-green-100 text-green-800',
  C: 'bg-yellow-100 text-yellow-800',
  D: 'bg-orange-100 text-orange-800',
  F: 'bg-red-100 text-red-800',
  'N/A': 'bg-gray-100 text-gray-600',
};

export function CategoryCard({ allocation, efficiency, narrative }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const monthlyAmount = allocation.amount / 12;
  const grade = efficiency?.grade ?? 'N/A';

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      style={{ borderLeftColor: allocation.color, borderLeftWidth: '4px' }}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight">
              {getContent(CONTENT.budgetCategory(allocation.id))}
            </h3>
            <p className="mt-1 text-lg font-bold text-primary">
              {formatShekel(monthlyAmount)}
              <span className="text-xs font-normal text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
          <Badge className={gradeColors[grade] ?? gradeColors['N/A']}>
            {getContent(CONTENT.grade(grade))}
          </Badge>
        </div>

        {/* Quick stats */}
        {efficiency && efficiency.estimatedOverhead > 0 && (
          <p className="mt-2 text-xs text-destructive">
            ~{formatShekel(efficiency.estimatedOverhead / 12)}/mo {getContent(CONTENT.CATEGORY_OVERHEAD)}
          </p>
        )}

        <p className="mt-1 text-xs text-muted-foreground">
          {allocation.percentage.toFixed(1)}% {getContent(CONTENT.CATEGORY_YOUR_MONEY)}
        </p>

        {/* Expanded detail */}
        {expanded && narrative && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <CategoryDetail
              narrative={narrative}
              efficiency={efficiency}
              monthlyAmount={monthlyAmount}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
