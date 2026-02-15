'use client';

import { useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { motion } from 'framer-motion';

export function ResultsSummary() {
  const t = useTranslations('results');
  const { result, displayMode } = useCalculatorStore();

  if (!result) return null;

  const isMonthly = displayMode === 'monthly';
  const divisor = isMonthly ? 12 : 1;

  const stats = [
    {
      label: isMonthly ? t('totalTaxMonthly') : t('totalTaxAnnual'),
      value: formatCurrency(result.totalDeductions / divisor),
      color: 'text-destructive',
    },
    {
      label: t('effectiveRate'),
      value: formatPercent(result.totalEffectiveRate),
      color: 'text-orange-600',
    },
    {
      label: isMonthly ? t('monthlyNet') : t('takeHome'),
      value: formatCurrency(result.netIncome / divisor),
      color: 'text-emerald-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border p-4 text-center"
              >
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className={`mt-1 text-2xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
