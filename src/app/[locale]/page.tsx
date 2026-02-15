import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomeClient } from '@/components/home-client';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('app');

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero — centered, prominent */}
      <section id="calculator" className="scroll-mt-20 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t('tagline')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('hookLine')}
        </p>
      </section>

      {/* Client-side interactive sections */}
      <HomeClient />

      {/* Disclaimer */}
      <div className="py-8 text-center text-sm text-muted-foreground">
        <p>{t('disclaimer')}</p>
      </div>
    </div>
  );
}
