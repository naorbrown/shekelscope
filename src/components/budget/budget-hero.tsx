'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import {
  analyzeEfficiency,
  calculateTotalOverhead,
  calculateTotalSavings,
} from '@/lib/efficiency-analyzer';
import { BudgetSummaryBar } from './budget-summary-bar';
import { BudgetCategoryCard } from './budget-category-card';
import { BudgetCategoryDetail } from './budget-category-detail';
import type { CategoryNarrative } from './budget-category-detail';
import narratives from '@/lib/data/budget-narratives.json';

const narrativeData = narratives as unknown as {
  categories: Record<string, CategoryNarrative>;
};

export function BudgetHero() {
  const t = useTranslations('results');
  const { result, completedActions, toggleAction } =
    useCalculatorStore();

  const displayDivisor = 12;

  const sorted = useMemo(
    () =>
      result
        ? [...result.budgetAllocation].sort((a, b) => b.amount - a.amount)
        : [],
    [result]
  );

  const efficiencyResults = useMemo(
    () => (result ? analyzeEfficiency(result.budgetAllocation) : []),
    [result]
  );

  const efficiencyMap = useMemo(
    () => new Map(efficiencyResults.map((e) => [e.categoryId, e])),
    [efficiencyResults]
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

  const totalContribution = result.totalDeductions / displayDivisor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Section header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">{t('budgetTitle')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('budgetSubtitle')}
        </p>
      </div>

      {/* Summary stats */}
      <BudgetSummaryBar
        totalContribution={totalContribution}
        totalOverhead={totalOverhead / displayDivisor}
        totalSavings={totalSavings / displayDivisor}
      />

      {/* Category grid with accordions */}
      <Accordion type="multiple">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map((item) => {
            const efficiency = efficiencyMap.get(item.id);
            const narrative = narrativeData.categories?.[item.id];

            return (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                  <BudgetCategoryCard
                    category={item}
                    efficiency={efficiency}
                    maxAmount={sorted[0].amount}
                    displayDivisor={displayDivisor}
                  />
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <BudgetCategoryDetail
                    category={item}
                    efficiency={efficiency}
                    narrative={narrative}
                    completedActions={completedActions}
                    toggleAction={toggleAction}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </div>
      </Accordion>
    </motion.div>
  );
}
