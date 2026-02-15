import { setRequestLocale } from 'next-intl/server';
import { WhyClient } from '@/components/why/why-client';

export default async function WhyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WhyClient />;
}
