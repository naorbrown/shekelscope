'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import whySources from '@/lib/data/why-sources.json';

interface TopicSectionProps {
  topicKey: string;
  index: number;
}

export function TopicSection({ topicKey }: TopicSectionProps) {
  const t = useTranslations(`why.topics.${topicKey}`);
  const wt = useTranslations('why');

  // Get the stats object keys dynamically based on the topic
  const statsMap: Record<string, string[]> = {
    housing: ['priceToIncome', 'permitTime', 'ilaControl'],
    costOfLiving: ['foodPremium', 'carPremium', 'telecomDrop'],
    healthcare: ['perCapitaSpend', 'oecdAverage', 'doctorShortage'],
    education: ['perStudentSpend', 'pisaScore', 'adminOverhead'],
    whyOlimLeave: ['departureRate', 'taxRelief', 'costOfLivingRank'],
    priceSalaryRatio: ['medianSalary', 'purchasingPowerRank', 'effectiveTaxBurden'],
    butterflyEffect: ['bureaucracyIndex', 'regulationCost', 'cycleDuration'],
  };

  const statKeys = statsMap[topicKey] || [];
  const sources = (whySources as Record<string, { name: string; url: string }[]>)[topicKey] || [];

  return (
    <AccordionItem value={topicKey}>
      <AccordionTrigger className="text-base font-semibold">
        {t('title')}
      </AccordionTrigger>
      <AccordionContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-5"
        >
          {/* Summary */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t('summary')}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {statKeys.map((statKey, i) => (
              <motion.div
                key={statKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="rounded-lg border bg-muted/50 p-3 text-center"
              >
                <div className="font-mono text-lg font-bold text-foreground">
                  {t(`stats.${statKey}`)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground capitalize">
                  {statKey.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Root Cause */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              {wt('rootCauseLabel')}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-red-700 dark:text-red-300">
              {t('rootCause')}
            </p>
          </div>

          {/* Alternative */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {wt('alternativeLabel')}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-emerald-700 dark:text-emerald-300">
              {t('alternative')}
            </p>
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <div className="space-y-1 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground">{wt('sourceLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {source.name}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
}
