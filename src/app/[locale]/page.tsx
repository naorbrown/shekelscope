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
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('tagline')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <RadicalBanner />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        {/* Left: Form */}
        <div>
          <TaxForm />
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          <div className="flex justify-end">
            <DisplayToggle />
          </div>
          <ResultsSummary />
          <ResultsBreakdown />
          <BudgetOverview />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>{t('disclaimer')}</p>
      </div>
    </div>
  );
}
