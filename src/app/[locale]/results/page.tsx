import { setRequestLocale } from 'next-intl/server';
import { ResultsPageClient } from '@/components/results-page-client';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ResultsPageClient />
    </div>
  );
}
