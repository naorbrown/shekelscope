'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import type { CostOfLivingSavings } from '@/lib/freedom-calculator';

interface CostOfLivingFreedomProps {
  savings: CostOfLivingSavings;
}

export function CostOfLivingFreedom({ savings }: CostOfLivingFreedomProps) {
  const t = useTranslations('freedom.costOfLiving');

  const rows = [
    {
      label: t('food'),
      current: savings.currentMonthlyFood,
      reformed: savings.reformedMonthlyFood,
      saving: savings.foodSavingsMonthly,
      note: t('foodNote'),
    },
    {
      label: t('car'),
      current: savings.currentCarCost,
      reformed: savings.reformedCarCost,
      saving: savings.carSavings,
      note: t('carNote'),
    },
    {
      label: t('rent'),
      current: savings.currentMonthlyRent,
      reformed: savings.reformedMonthlyRent,
      saving: savings.rentSavingsMonthly,
      note: t('rentNote'),
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
                <th className="text-start py-2 font-medium">{t('category')}</th>
                <th className="text-end py-2 font-medium text-red-600 dark:text-red-400">
                  {t('current')}
                </th>
                <th className="text-end py-2 font-medium text-emerald-600 dark:text-emerald-400">
                  {t('reformed')}
                </th>
                <th className="text-end py-2 font-medium">{t('savings')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <td className="py-3">
                    <span className="font-medium">{row.label}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {row.note}
                    </span>
                  </td>
                  <td className="text-end py-3 font-mono text-red-600 dark:text-red-400">
                    {formatCurrency(row.current)}
                  </td>
                  <td className="text-end py-3 font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(row.reformed)}
                  </td>
                  <td className="text-end py-3 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(row.saving)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('totalMonthly')}
              </p>
              <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(savings.totalMonthlySavings)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('totalAnnual')}
              </p>
              <p className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-300">
                {formatCurrency(savings.totalAnnualSavings)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
