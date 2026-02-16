'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { analyzeEfficiency } from '@/lib/efficiency-analyzer';
import {
  calculateReformedTax,
  calculateCostOfLivingSavings,
  calculateInvestmentFreedom,
  calculateFreedomScore,
} from '@/lib/freedom-calculator';
import { formatCurrency } from '@/components/shared/currency-display';
import { SectionWrapper } from '@/components/sections/section-wrapper';
import { PaycheckComparison } from './paycheck-comparison';
import { CostOfLivingFreedom } from './cost-of-living-freedom';
import { InvestmentFreedom } from './investment-freedom';
import { FreedomPrinciples } from './freedom-principles';
import { FreedomScoreCard } from './freedom-score-card';
import freedomData from '@/lib/data/freedom-analysis.json';
import type { ReformScenario } from '@/lib/data/types';

export function FreedomSection() {
  const t = useTranslations('freedom');
  const result = useCalculatorStore((s) => s.result);
  const [scenarioKey, setScenarioKey] = useState<'moderate' | 'ambitious'>(
    'moderate'
  );

  if (!result) return null;

  const scenario = freedomData.reformScenarios[
    scenarioKey
  ] as ReformScenario;
  const reformed = calculateReformedTax(result, scenario);
  const costSavings = calculateCostOfLivingSavings(result.monthlyNet);
  const investable = result.netIncome * 0.1;
  const investmentResult = calculateInvestmentFreedom(investable);
  const efficiency = analyzeEfficiency(result.budgetAllocation);
  const freedomScore = calculateFreedomScore(result, efficiency);

  return (
    <SectionWrapper
      id="freedom"
      title={t('title')}
      subtitle={t('subtitle')}
      requiresCalculation
    >
      {/* Scenario Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setScenarioKey('moderate')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            scenarioKey === 'moderate'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          {t('scenarioToggle.moderate')}
        </button>
        <button
          onClick={() => setScenarioKey('ambitious')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            scenarioKey === 'ambitious'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          {t('scenarioToggle.ambitious')}
        </button>
      </div>

      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {t('hero.currentBurden')}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(reformed.currentTotalDeductions / 12)}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {t('hero.reformedBurden')}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(reformed.reformedTotalDeductions / 12)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {t('hero.monthlySavings')}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(reformed.monthlySavings)}
          </p>
        </div>
      </motion.div>

      <PaycheckComparison reformed={reformed} result={result} />
      <CostOfLivingFreedom savings={costSavings} />
      <InvestmentFreedom
        investmentResult={investmentResult}
        annualInvestable={investable}
      />
      <FreedomPrinciples />
      <FreedomScoreCard score={freedomScore} />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 rounded-lg bg-primary/5 border border-primary/20 p-6 text-center"
      >
        <p className="text-sm font-semibold text-foreground">
          {t('callToAction')}
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
