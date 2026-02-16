'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { formatCurrency } from '@/components/shared/currency-display';

export function DailyTaxHero() {
  const t = useTranslations('dashboard');
  const { result } = useCalculatorStore();

  if (!result) return null;

  const dailyTax = result.dailyTax;
  const monthlyTax = result.totalDeductions / 12;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-8 text-center"
    >
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {t('receiptSubtitle')}
      </p>
      <p className="text-5xl sm:text-6xl font-bold font-mono text-primary">
        {formatCurrency(dailyTax, true)}
      </p>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>
          {formatCurrency(monthlyTax)}<span className="text-xs">/mo</span>
        </span>
        <span className="text-muted-foreground/30">|</span>
        <span className="font-semibold text-foreground">
          {(result.totalEffectiveRate * 100).toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
