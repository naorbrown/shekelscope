'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import {
  analyzeEfficiency,
  calculateTotalOverhead,
  calculateTotalSavings,
} from '@/lib/efficiency-analyzer';
import { formatCurrency } from '@/components/shared/currency-display';
import { CostCard } from '@/components/insights/cost-card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import costAnalysisData from '@/lib/data/cost-analysis.json';
import type { CategoryAnalysis } from '@/lib/data/types';

const categoryMap = new Map<string, CategoryAnalysis>(
  costAnalysisData.categories.map((c) => [c.id, c as CategoryAnalysis])
);

export function InsightsClient() {
  const t = useTranslations('insights');
  const locale = useLocale();
  const { result } = useCalculatorStore();

  if (!result) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}`}>
              {locale === 'he' ? 'חזרו למחשבון' : 'Go to Calculator'}
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const efficiencyResults = analyzeEfficiency(result.budgetAllocation);
  const totalOverhead = calculateTotalOverhead(efficiencyResults);
  const totalSavings = calculateTotalSavings(efficiencyResults);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
        <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
          {t('personalImpact')}
        </p>
      </motion.div>

      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 grid gap-4 sm:grid-cols-2"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {t('heroStat', { amount: formatCurrency(totalOverhead) })}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(totalOverhead)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {t('potentialSavings', { amount: formatCurrency(totalSavings) })}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalSavings)}
          </p>
        </div>
      </motion.div>

      {/* Cost Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {efficiencyResults.map((eff, i) => {
          const allocation = result.budgetAllocation.find((a) => a.id === eff.categoryId);
          if (!allocation) return null;
          return (
            <CostCard
              key={eff.categoryId}
              efficiency={eff}
              allocation={allocation}
              analysis={categoryMap.get(eff.categoryId)}
              index={i}
            />
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-lg font-medium text-foreground">
          {t('callToAction')}
        </p>
        <Button asChild className="mt-4" size="lg">
          <Link href={`/${locale}/action`}>
            {locale === 'he' ? 'פעלו עכשיו' : 'Take Action'}
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
