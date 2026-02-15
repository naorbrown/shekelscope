import { setRequestLocale } from 'next-intl/server';
import { InsightsClient } from '@/components/insights/insights-client';

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InsightsClient />;
}
