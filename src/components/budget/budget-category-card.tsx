'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/components/shared/currency-display';
import type { BudgetAllocationResult } from '@/lib/tax-engine/types';
import type { EfficiencyResult } from '@/lib/efficiency-analyzer';

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-green-500/15', text: 'text-green-600 dark:text-green-400' },
  B: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  C: { bg: 'bg-yellow-500/15', text: 'text-yellow-600 dark:text-yellow-400' },
  D: { bg: 'bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400' },
  F: { bg: 'bg-red-500/15', text: 'text-red-600 dark:text-red-400' },
  'N/A': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

interface BudgetCategoryCardProps {
  category: BudgetAllocationResult;
  efficiency: EfficiencyResult | undefined;
  maxAmount: number;
  displayDivisor: number;
}

export function BudgetCategoryCard({
  category,
  efficiency,
  maxAmount,
  displayDivisor,
}: BudgetCategoryCardProps) {
  const bt = useTranslations('budget');
  const grade = efficiency?.grade ?? 'N/A';
  const gradeStyle = GRADE_COLORS[grade] ?? GRADE_COLORS['N/A'];
  const barWidth = maxAmount > 0 ? (category.amount / maxAmount) * 100 : 0;
  const amount = category.amount / displayDivisor;

  return (
    <div className="flex w-full pe-2">
      {/* Color accent */}
      <div
        className="w-1 shrink-0 rounded-s-sm"
        style={{ backgroundColor: category.color }}
      />

      <div className="flex-1 min-w-0 ps-3 py-1">
        {/* Top row: name + grade + percentage */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">
            {bt(category.id)}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {grade !== 'N/A' && (
              <span
                className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${gradeStyle.bg} ${gradeStyle.text}`}
              >
                {grade}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {category.percentage}%
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-lg font-bold font-mono mt-0.5">
          {formatCurrency(amount)}
        </div>

        {/* Proportional bar */}
        <div className="h-1.5 w-full rounded-full bg-muted mt-2">
          <motion.div
            className="h-1.5 rounded-full"
            style={{ backgroundColor: category.color }}
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
