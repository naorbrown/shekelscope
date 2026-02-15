import { setRequestLocale } from 'next-intl/server';
import { ActionClient } from '@/components/action/action-client';

export default async function ActionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ActionClient />;
}
