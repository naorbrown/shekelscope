'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { analyzeEfficiency, calculateTotalOverhead, calculateTotalSavings } from '@/lib/efficiency-analyzer';
import { useCalculatorStore } from '@/lib/store/calculator-store';

const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' },
  B: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  C: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/30' },
  D: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
  F: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
  'N/A': { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground/30' },
};

function getGradeStyle(grade: string) {
  return GRADE_COLORS[grade] ?? GRADE_COLORS['N/A'];
}

export function EfficiencyScore() {
  const t = useTranslations('dashboard');
  const { result } = useCalculatorStore();

  const budgetAllocation = useMemo(
    () => result?.budgetAllocation ?? [],
    [result]
  );

  const efficiencyResults = useMemo(
    () => analyzeEfficiency(budgetAllocation),
    [budgetAllocation]
  );

  const totalOverhead = useMemo(
    () => calculateTotalOverhead(efficiencyResults),
    [efficiencyResults]
  );

  const totalSavings = useMemo(
    () => calculateTotalSavings(efficiencyResults),
    [efficiencyResults]
  );

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('efficiencyTitle')}</CardTitle>
          <CardDescription>{t('efficiencySubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-red-500/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('overheadLabel')}</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalOverhead)}
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('savingsLabel')}</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalSavings)}
              </p>
            </div>
          </div>

          {/* Grade cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {efficiencyResults.map((item, index) => {
              const allocation = budgetAllocation.find(
                (a) => a.id === item.categoryId
              );
              const name = allocation ? allocation.nameEn : item.categoryId;
              const gradeStyle = getGradeStyle(item.grade);
              const overheadPct =
                item.yourContribution > 0
                  ? item.estimatedOverhead / item.yourContribution
                  : 0;
              const reachesPct =
                item.yourContribution > 0
                  ? item.reachesService / item.yourContribution
                  : 0;

              return (
                <motion.div
                  key={item.categoryId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className={`rounded-lg border p-3 ${gradeStyle.border}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{name}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatCurrency(item.yourContribution)}/yr
                      </p>
                    </div>
                    <div
                      className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${gradeStyle.bg} ${gradeStyle.text}`}
                    >
                      {item.grade}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overhead</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {formatPercent(overheadPct)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reaches service</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatPercent(reachesPct)}
                      </span>
                    </div>
                    {item.potentialSavings > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potential savings</span>
                        <span className="font-medium">
                          {formatCurrency(item.potentialSavings)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${reachesPct * 100}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
