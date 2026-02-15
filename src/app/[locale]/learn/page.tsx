import { setRequestLocale } from 'next-intl/server';
import { LearnPageClient } from '@/components/learn-page-client';

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <LearnPageClient />
    </div>
  );
}
