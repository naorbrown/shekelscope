'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export function ResultsSummary() {
  const t = useTranslations('results');
  const locale = useLocale();
  const { result, displayMode } = useCalculatorStore();

  if (!result) return null;

  const isMonthly = displayMode === 'monthly';
  const divisor = isMonthly ? 12 : 1;
  const isHe = locale === 'he';

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
        <CardContent className="space-y-4">
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

          {result.arnona && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border bg-muted/30 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isHe ? 'ארנונה' : 'Arnona (Municipal Tax)'}
                  {' — '}
                  {isHe ? result.arnona.cityNameHe : result.arnona.cityNameEn}
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {isHe ? 'חודשי' : 'Monthly'}
                  </div>
                  <div className="text-lg font-bold font-mono text-destructive">
                    {formatCurrency(result.arnona.monthlyAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {isHe ? 'שנתי' : 'Annual'}
                  </div>
                  <div className="text-lg font-bold font-mono text-destructive">
                    {formatCurrency(result.arnona.annualAmount)}
                  </div>
                </div>
                <div className="ms-auto text-xs text-muted-foreground">
                  {formatCurrency(result.arnona.ratePerSqm)}/{isHe ? 'מ"ר' : 'sqm'}
                </div>
              </div>
            </motion.div>
          )}

          {result.dailyTax > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-muted-foreground"
            >
              {formatCurrency(result.dailyTax)} {t('dailyTax')}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
