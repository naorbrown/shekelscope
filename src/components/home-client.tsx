'use client';

import { useTranslations } from 'next-intl';
import { TaxForm } from '@/components/calculator/tax-form';
import { ResultsSummary } from '@/components/calculator/results-summary';
import { ResultsBreakdown } from '@/components/calculator/results-breakdown';
import { BudgetOverview } from '@/components/calculator/budget-overview';
import { DisplayToggle } from '@/components/calculator/display-toggle';
import { RadicalBanner } from '@/components/calculator/radical-banner';
import { TaxDonut } from '@/components/dashboard/tax-donut';
import { DailyReceipt } from '@/components/dashboard/daily-receipt';
import { OECDComparison } from '@/components/dashboard/oecd-comparison';
import { EfficiencyScore } from '@/components/dashboard/efficiency-score';
import { BudgetTreemap } from '@/components/dashboard/budget-treemap';
import { SankeyFlow } from '@/components/dashboard/sankey-flow';
import { CostOfLivingSection } from '@/components/sections/cost-of-living-section';
import { HousingCrisisSection } from '@/components/sections/housing-crisis-section';
import { CentralBankSection } from '@/components/sections/central-bank-section';
import { TalkingPointsDebunker } from '@/components/sections/talking-points-debunker';
import { SectionWrapper } from '@/components/sections/section-wrapper';
import { ActionLevel, LEVEL_CONFIGS } from '@/components/action/action-level';
import { ShareCard } from '@/components/action/share-card';
import { KnessetContact } from '@/components/action/knesset-contact';
import { ImpactCounter } from '@/components/action/impact-counter';
import { FreedomSection } from '@/components/freedom/freedom-section';
import { ProfileManager } from '@/components/calculator/profile-manager';
import { ScenarioComparison } from '@/components/calculator/scenario-comparison';
import { useCalculatorStore } from '@/lib/store/calculator-store';

export function HomeClient() {
  const t = useTranslations();
  const result = useCalculatorStore((s) => s.result);

  return (
    <>
      {/* Calculator input */}
      <div className="mb-12">
        <TaxForm />
      </div>

      {/* === Conditional sections: appear after calculation === */}
      {result && (
        <>
          {/* Profile manager + display toggle */}
          <section id="results" className="scroll-mt-20 space-y-6 mb-12">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <ProfileManager />
              <DisplayToggle />
            </div>
            <ResultsSummary />
            <ResultsBreakdown />
          </section>

          {/* Section 3: Visual tax breakdown */}
          <section id="your-taxes" className="scroll-mt-20 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaxDonut />
              <DailyReceipt />
            </div>
          </section>

          {/* Section 4: Facts banner */}
          <div className="mb-12">
            <RadicalBanner />
          </div>

          {/* Section 5: Budget treemap + overview */}
          <section id="budget" className="scroll-mt-20 space-y-6 mb-12">
            <BudgetTreemap />
            <BudgetOverview />
          </section>

          {/* Section 5b: Follow the Money */}
          <section id="flow" className="scroll-mt-20 mb-12">
            <SankeyFlow />
          </section>

          {/* Section 6: Israel vs World */}
          <section id="compare" className="scroll-mt-20 mb-12">
            <OECDComparison />
          </section>

          {/* Section 7: Efficiency scorecard */}
          <section id="efficiency" className="scroll-mt-20 mb-12">
            <EfficiencyScore />
          </section>

          {/* Section 7b: Scenario comparison (shows when 2+ profiles saved) */}
          <section id="scenarios" className="scroll-mt-20 mb-12">
            <ScenarioComparison />
          </section>
        </>
      )}

      {/* === Always-visible educational sections === */}

      {/* Section 8: Economic Freedom Analysis */}
      <FreedomSection />

      {/* Section 9: Cost of Living */}
      <CostOfLivingSection />

      {/* Section 9: Housing Crisis */}
      <HousingCrisisSection />

      {/* Section 10: Central Bank / Inflation Tax */}
      <CentralBankSection />

      {/* Section 11: Talking Points Debunker */}
      <TalkingPointsDebunker />

      {/* Section 12: Take Action */}
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

        {/* Civic platforms directory */}
        <div className="mb-6">
          <KnessetContact />
        </div>

        {/* Impact tracker */}
        <div className="mb-6">
          <ImpactCounter />
        </div>

        <ShareCard />
      </SectionWrapper>
    </>
  );
}
