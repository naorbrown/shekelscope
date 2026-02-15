'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { DEFAULT_MONTHLY_INCOME } from '@/lib/constants';
import { DailyTaxHero } from '@/components/results/daily-tax-hero';
import { DisplayToggle } from '@/components/calculator/display-toggle';
import { ProfileManager } from '@/components/calculator/profile-manager';
import { ResultsSummary } from '@/components/calculator/results-summary';
import { ResultsBreakdown } from '@/components/calculator/results-breakdown';
import { TaxDonut } from '@/components/dashboard/tax-donut';
import { BudgetOverview } from '@/components/calculator/budget-overview';
import { EfficiencyScore } from '@/components/dashboard/efficiency-score';
import { RadicalBanner } from '@/components/calculator/radical-banner';
import { FreedomSection } from '@/components/freedom/freedom-section';
import { SectionWrapper } from '@/components/sections/section-wrapper';
import { ActionLevel, LEVEL_CONFIGS } from '@/components/action/action-level';
import { KnessetContact } from '@/components/action/knesset-contact';
import { ImpactCounter } from '@/components/action/impact-counter';
import { ShareCard } from '@/components/action/share-card';

export function ResultsPageClient() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { result, monthlyIncome, hasCalculated } = useCalculatorStore();

  // Re-calculate on mount if inputs exist but result is missing (page refresh / direct nav)
  useEffect(() => {
    const state = useCalculatorStore.getState();
    if (!state.result && state.monthlyIncome > 0) {
      state.calculate();
    }
  }, []);

  // Guard: redirect to calculator if user hasn't entered anything
  useEffect(() => {
    if (!result && monthlyIncome === DEFAULT_MONTHLY_INCOME && !hasCalculated) {
      // Wait a tick for store hydration from localStorage
      const timeout = setTimeout(() => {
        const state = useCalculatorStore.getState();
        if (!state.result && !state.hasCalculated) {
          router.replace(`/${locale}`);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [result, monthlyIncome, hasCalculated, router, locale]);

  if (!result) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Hero: Daily tax amount */}
      <div className="mb-8">
        <DailyTaxHero />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <ProfileManager />
        <DisplayToggle />
      </div>

      {/* Tax summary + donut */}
      <section className="space-y-6 mb-12">
        <ResultsSummary />
        <div className="max-w-md mx-auto">
          <TaxDonut />
        </div>
        <ResultsBreakdown />
      </section>

      {/* Ministry breakdown */}
      <section className="mb-12">
        <BudgetOverview />
      </section>

      {/* Efficiency grades */}
      <section className="mb-12">
        <EfficiencyScore />
      </section>

      {/* Facts */}
      <div className="mb-12">
        <RadicalBanner />
      </div>

      {/* Reform scenarios */}
      <FreedomSection />

      {/* Take Action */}
      <SectionWrapper
        id="action"
        title={t('action.title')}
        subtitle={t('action.subtitle')}
      >
        <div className="space-y-0 mb-8">
          {LEVEL_CONFIGS.map((_, i) => (
            <ActionLevel key={LEVEL_CONFIGS[i].id} levelIndex={i} />
          ))}
        </div>

        <div className="mb-6">
          <KnessetContact />
        </div>

        <div className="mb-6">
          <ImpactCounter />
        </div>

        <ShareCard />
      </SectionWrapper>
    </>
  );
}
