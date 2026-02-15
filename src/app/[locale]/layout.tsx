import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { routing } from '@/lib/i18n/routing';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const siteUrl = 'https://naorbrown.github.io/openshekel';

export const metadata: Metadata = {
  title: 'Open Shekel - Israeli Tax Transparency',
  description:
    'See exactly where every shekel of your taxes goes. Israeli tax calculator with budget breakdown and civic action tools.',
  openGraph: {
    title: 'Open Shekel - Israeli Tax Transparency',
    description:
      'See exactly where every shekel of your taxes goes.',
    url: siteUrl,
    siteName: 'Open Shekel',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Open Shekel - Israeli Tax Transparency',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Shekel - Israeli Tax Transparency',
    description:
      'See exactly where every shekel of your taxes goes.',
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TooltipProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
