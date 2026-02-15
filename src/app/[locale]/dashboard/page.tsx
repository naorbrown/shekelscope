import { setRequestLocale } from 'next-intl/server';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DashboardClient />
    </div>
  );
}
