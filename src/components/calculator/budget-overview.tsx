'use client';

import { useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import { motion } from 'framer-motion';

export function BudgetOverview() {
  const t = useTranslations('results');
  const bt = useTranslations('budget');
  const { result, displayMode } = useCalculatorStore();

  if (!result) return null;

  const d = displayMode === 'monthly' ? 12 : 1;
  const sorted = [...result.budgetAllocation].sort((a, b) => b.amount - a.amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('budgetBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sorted.map((item) => {
              const maxAmount = sorted[0].amount;
              const barWidth = (item.amount / maxAmount) * 100;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{bt(item.id)}</span>
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(item.amount / d)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
