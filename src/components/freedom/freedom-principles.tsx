'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import freedomData from '@/lib/data/freedom-analysis.json';

export function FreedomPrinciples() {
  const t = useTranslations('freedom.principles');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h3 className="text-xl font-bold mb-1">{t('title')}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t('subtitle')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {freedomData.economicPrinciples.map((principle, i) => (
          <motion.div
            key={principle.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <blockquote className="border-s-2 border-primary ps-3 text-sm italic text-foreground">
                  &ldquo;{principle.principle}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs font-medium text-primary">
                  &mdash; {principle.author}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {principle.application}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Telecom proof callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 text-center"
      >
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          {t('telecomProof')}
        </p>
      </motion.div>
    </motion.div>
  );
}
