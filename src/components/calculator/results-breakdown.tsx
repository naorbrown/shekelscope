'use client';

import { useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { motion } from 'framer-motion';

function Row({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: boolean;
  highlight?: 'positive' | 'negative';
}) {
  const color =
    highlight === 'positive'
      ? 'text-emerald-600'
      : highlight === 'negative'
        ? 'text-destructive'
        : '';

  return (
    <div
      className={`flex items-center justify-between py-1.5 ${sub ? 'ps-4 text-sm text-muted-foreground' : ''}`}
    >
      <span>{label}</span>
      <span className={`font-mono ${color}`}>{value}</span>
    </div>
  );
}

export function ResultsBreakdown() {
  const t = useTranslations('results');
  const { result } = useCalculatorStore();

  if (!result) return null;

  const d = 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Income Tax Detail */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('incomeTax')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Row
            label={t('grossTax')}
            value={formatCurrency(result.incomeTax.grossTax / d)}
          />
          <Row
            label={`${t('taxCredits')} (${result.taxCredits.totalPoints} ${t('creditPoints')})`}
            value={`-${formatCurrency(result.incomeTax.creditPointsValue / d)}`}
            highlight="positive"
          />
          <Separator />
          <Row
            label={t('afterCredits')}
            value={formatCurrency(result.incomeTax.netTax / d)}
            highlight="negative"
          />

          {/* Bracket breakdown */}
          {result.incomeTax.brackets.length > 0 && (
            <div className="mt-3">
              <div className="mb-2 text-sm font-medium text-muted-foreground">
                {t('perBracket')}
              </div>
              <div className="space-y-1">
                {result.incomeTax.brackets.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-muted-foreground"
                  >
                    <span>
                      {formatPercent(b.rate)} — {formatCurrency(b.taxableInBracket / d)}{' '}
                      {t('taxable')}
                    </span>
                    <span className="font-mono">
                      {formatCurrency(b.taxInBracket / d)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NI + Health */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {t('nationalInsurance')} & {t('healthTax')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Row
            label={t('nationalInsurance')}
            value={formatCurrency(result.nationalInsurance.employeeContribution / d)}
            highlight="negative"
          />
          <Row
            label={t('healthTax')}
            value={formatCurrency(result.healthTax.contribution / d)}
            highlight="negative"
          />
          <Separator />
          <Row
            label={t('employerCost')}
            value={formatCurrency(result.employerCost / d)}
            sub
          />
        </CardContent>
      </Card>

      {/* VAT & Daily */}
      <Card>
        <CardContent className="pt-6 space-y-1">
          {result.vat && (
            <Row
              label={t('vatEstimate')}
              value={formatCurrency(result.vat.annualVatPaid / d)}
              sub
            />
          )}
          <Row
            label={t('dailyTax')}
            value={formatCurrency(result.dailyTax)}
            sub
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
