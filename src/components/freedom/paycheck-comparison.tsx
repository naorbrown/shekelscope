'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import type { ReformedTaxResult } from '@/lib/freedom-calculator';
import type { TotalTaxResult } from '@/lib/tax-engine/types';

interface PaycheckComparisonProps {
  reformed: ReformedTaxResult;
  result: TotalTaxResult;
}

export function PaycheckComparison({
  reformed,
  result,
}: PaycheckComparisonProps) {
  const t = useTranslations('freedom.paycheck');

  const rows = [
    {
      label: t('gross'),
      current: result.grossIncome / 12,
      reformedVal: result.grossIncome / 12,
    },
    {
      label: t('deductions'),
      current: reformed.currentTotalDeductions / 12,
      reformedVal: reformed.reformedTotalDeductions / 12,
      negative: true,
    },
    {
      label: t('net'),
      current: (result.grossIncome - reformed.currentTotalDeductions) / 12,
      reformedVal: (result.grossIncome - reformed.reformedTotalDeductions) / 12,
      highlight: true,
    },
  ];

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

      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-start py-2 font-medium" />
                <th className="text-end py-2 font-medium text-red-600 dark:text-red-400">
                  {t('current')}
                </th>
                <th className="text-end py-2 font-medium text-emerald-600 dark:text-emerald-400">
                  {t('reformed')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className={row.highlight ? 'font-bold border-t-2' : ''}
                >
                  <td className="py-2">{row.label}</td>
                  <td
                    className={`text-end py-2 font-mono ${row.negative ? 'text-red-600 dark:text-red-400' : ''}`}
                  >
                    {row.negative ? '-' : ''}
                    {formatCurrency(row.current)}
                  </td>
                  <td
                    className={`text-end py-2 font-mono ${row.highlight ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                  >
                    {row.negative ? '-' : ''}
                    {formatCurrency(row.reformedVal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-muted-foreground">
              {t('effectiveRate')}:{' '}
              <span className="font-mono font-medium text-red-600 dark:text-red-400">
                {(reformed.currentEffectiveRate * 100).toFixed(1)}%
              </span>{' '}
              &rarr;{' '}
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {(reformed.reformedEffectiveRate * 100).toFixed(1)}%
              </span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('monthlySavings')}
              </p>
              <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(reformed.monthlySavings)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('extraMonths')}
              </p>
              <p className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {reformed.extraMonthsOfSalary}
              </p>
            </div>
          </div>

          {reformed.extraMonthsOfSalary > 0 && (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {t('extraMonthsDesc', {
                months: reformed.extraMonthsOfSalary.toString(),
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
