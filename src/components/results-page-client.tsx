'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { DEFAULT_MONTHLY_INCOME } from '@/lib/constants';
import { DailyTaxHero } from '@/components/results/daily-tax-hero';
import { DisplayToggle } from '@/components/calculator/display-toggle';
import { ResultsBreakdown } from '@/components/calculator/results-breakdown';
import { BudgetHero } from '@/components/budget/budget-hero';
import { ImpactCounter } from '@/components/action/impact-counter';
import { ShareCard } from '@/components/action/share-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function ResultsPageClient() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('results');
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
      <div className="mb-6">
        <DailyTaxHero />
      </div>

      {/* Display toggle */}
      <div className="flex justify-center mb-6">
        <DisplayToggle />
      </div>

      {/* Collapsible detailed tax breakdown */}
      <div className="mb-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="detailed-breakdown" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm font-medium">
              {t('detailedBreakdown')}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ResultsBreakdown />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* THE MAIN SECTION: Where Your Taxes Go */}
      <section className="mb-12">
        <BudgetHero />
      </section>

      {/* Footer CTA */}
      <section className="space-y-4">
        <ImpactCounter />
        <ShareCard />
      </section>
    </>
  );
}
