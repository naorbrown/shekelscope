'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const appT = useTranslations('app');

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Data sources */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            {t('sources')}
          </h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.gov.il/en/departments/israel-tax-authority"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {t('taxAuthority')}
              </a>
            </li>
            <li>
              <a
                href="https://www.btl.gov.il/English%20Homepage/Pages/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {t('btl')}
              </a>
            </li>
            <li>
              <a
                href="https://www.gov.il/en/departments/ministry_of_finance"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {t('mof')}
              </a>
            </li>
          </ul>
        </div>

        {/* Last updated */}
        <p className="mb-4 text-xs text-muted-foreground">
          {t('lastUpdated')}: January 2025
        </p>

        {/* Disclaimer */}
        <p className="mb-4 text-xs text-muted-foreground">
          {appT('disclaimer')}
        </p>

        {/* Built with love */}
        <p className="text-xs text-muted-foreground">
          Built with ❤️ for Israeli taxpayers
        </p>
      </div>
    </footer>
  );
}
