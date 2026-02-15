'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ActionLevel, LEVEL_CONFIGS } from '@/components/action/action-level';
import { ShareCard } from '@/components/action/share-card';

export function ActionClient() {
  const t = useTranslations('action');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Share Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <ShareCard />
      </motion.div>

      {/* Action Levels — vertical journey */}
      <div className="space-y-0">
        {LEVEL_CONFIGS.map((_, i) => (
          <ActionLevel key={LEVEL_CONFIGS[i].id} levelIndex={i} />
        ))}
      </div>
    </div>
  );
}
