'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/components/shared/currency-display';

interface BudgetSummaryBarProps {
  totalContribution: number;
  totalOverhead: number;
  totalSavings: number;
}

export function BudgetSummaryBar({
  totalContribution,
  totalOverhead,
  totalSavings,
}: BudgetSummaryBarProps) {
  const t = useTranslations('results');

  const stats = [
    {
      label: t('totalContribution'),
      value: totalContribution,
      bg: 'bg-muted/50',
      text: 'text-foreground',
    },
    {
      label: t('overheadEstimate'),
      value: totalOverhead,
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
    },
    {
      label: t('potentialSavings'),
      value: totalSavings,
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`rounded-lg ${stat.bg} p-3 text-center`}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className={`text-lg font-bold font-mono ${stat.text}`}>
            {formatCurrency(stat.value)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
