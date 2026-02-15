import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TaxForm } from '@/components/calculator/tax-form';
import { ResultsSummary } from '@/components/calculator/results-summary';
import { ResultsBreakdown } from '@/components/calculator/results-breakdown';
import { BudgetOverview } from '@/components/calculator/budget-overview';
import { DisplayToggle } from '@/components/calculator/display-toggle';
import { RadicalBanner } from '@/components/calculator/radical-banner';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('app');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero — centered, prominent */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t('tagline')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('hookLine')}
        </p>
      </div>

      {/* Calculator — centered, search-bar style */}
      <div className="mb-12">
        <TaxForm />
      </div>

      {/* Results — full-width, vertical stack */}
      <div className="space-y-6">
        <div className="flex justify-end">
          <DisplayToggle />
        </div>
        <ResultsSummary />
        <ResultsBreakdown />

        {/* Facts banner — appears with results, not above */}
        <RadicalBanner />

        <BudgetOverview />
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>{t('disclaimer')}</p>
      </div>
    </div>
  );
}
