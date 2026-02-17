'use client';

import { useRef } from 'react';
import { useCalculatorStore } from '@/modules/store';
import type { TaxDataBundle, ContentDataBundle } from '@/modules/data/loader';
import { getContent, CONTENT } from '@/content';
import { SalaryInput } from './salary-input';
import { TaxSummary } from './tax-summary';
import { BudgetBreakdown } from './budget-breakdown';
import { ActionSection } from './action-section';

interface AppShellProps {
  taxData: TaxDataBundle;
  contentData: ContentDataBundle;
}

export function AppShell({ taxData, contentData }: AppShellProps) {
  const result = useCalculatorStore((s) => s.result);
  const hasCalculated = useCalculatorStore((s) => s.hasCalculated);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculated = () => {
    // Scroll to results after a short delay for the DOM to update
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {getContent(CONTENT.SECTION_HERO_TITLE)}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          {getContent(CONTENT.SECTION_HERO_SUBTITLE)}
        </p>
      </header>

      {/* Step 1: Input */}
      <SalaryInput cities={taxData.arnonaRates.cities} onCalculated={handleCalculated} />

      {/* Steps 2 & 3: Results — only shown after calculate */}
      {hasCalculated && result && (
        <div ref={resultsRef} className="mt-12 space-y-16">
          <TaxSummary result={result} />
          <BudgetBreakdown
            result={result}
            costAnalysis={taxData.costAnalysis}
            narratives={contentData.budgetNarratives}
          />
          <ActionSection actionResources={contentData.actionResources} />
        </div>
      )}
    </div>
  );
}
