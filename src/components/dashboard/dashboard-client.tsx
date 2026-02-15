'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { TaxDonut } from './tax-donut';
import { DailyReceipt } from './daily-receipt';
import { OECDComparison } from './oecd-comparison';
import { BudgetTreemap } from './budget-treemap';
import { EfficiencyScore } from './efficiency-score';
import { SankeyDiagram } from './sankey-diagram';

export function DashboardClient() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const result = useCalculatorStore((s) => s.result);
  const displayMode = useCalculatorStore((s) => s.displayMode);

  // No calculation result yet -- prompt the user
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-6 py-20 text-center"
      >
        <div className="rounded-full bg-muted p-6">
          <Calculator className="size-12 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            {t('noData')}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/${locale}/calculator`}>
            {t('goToCalculator')}
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </motion.div>

      {/* Top row: Donut + Receipt side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaxDonut result={result} displayMode={displayMode} />
        <DailyReceipt result={result} />
      </div>

      {/* Sankey Diagram: full width */}
      <SankeyDiagram result={result} />

      {/* Budget Treemap */}
      <BudgetTreemap
        budgetAllocation={result.budgetAllocation}
        displayMode={displayMode}
      />

      {/* OECD Comparison */}
      <OECDComparison />

      {/* Efficiency Scorecard */}
      <EfficiencyScore budgetAllocation={result.budgetAllocation} />
    </div>
  );
}
