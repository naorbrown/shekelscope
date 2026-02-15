'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ExternalLink } from 'lucide-react';

interface DataSourceBadgeProps {
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  isLive: boolean;
}

export function DataSourceBadge({
  source,
  sourceUrl,
  lastUpdated,
  isLive,
}: DataSourceBadgeProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
  }).format(new Date(lastUpdated));

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
      <span>
        {t('dataSource')}:{' '}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground inline-flex items-center gap-0.5"
        >
          {source}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </span>
      <span className="text-muted-foreground/50">·</span>
      <span
        className={
          isLive
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }
      >
        {isLive ? t('liveData') : t('localData')}
      </span>
      <span className="text-muted-foreground/50">·</span>
      <span>{t('lastUpdated', { date: formattedDate })}</span>
    </div>
  );
}
