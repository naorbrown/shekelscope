'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function RadicalBanner() {
  const t = useTranslations('calculator.banner');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 rounded-lg border border-orange-300 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950/30"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-orange-600 dark:text-orange-400" />
        <div className="space-y-2">
          <ul className="space-y-1 text-sm font-medium text-orange-800 dark:text-orange-200">
            <li>{t('line1')}</li>
            <li>{t('line2')}</li>
            <li>{t('line3')}</li>
            <li>{t('line4')}</li>
          </ul>
          <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
            {t('punchline')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
