'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { calculateTotalTax } from '@/lib/tax-engine/total';
import type { TaxpayerProfile, TotalTaxResult } from '@/lib/tax-engine/types';
import type { TaxProfile } from '@/lib/store/types';
import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

function computeResult(profile: TaxProfile): TotalTaxResult {
  const taxpayerProfile: TaxpayerProfile = {
    annualGrossIncome: profile.monthlyIncome * 12,
    employmentType: profile.employmentType,
    gender: profile.gender,
    taxYear: 2025,
    childAges: profile.childAges.length > 0 ? profile.childAges : undefined,
    cityId: profile.selectedCity ?? undefined,
  };
  return calculateTotalTax(taxpayerProfile);
}

function ResultColumn({
  label,
  result,
  monthlyIncome,
}: {
  label: string;
  result: TotalTaxResult;
  monthlyIncome: number;
}) {
  const tResults = useTranslations('results');

  return (
    <div className="flex-1 space-y-3 p-4 rounded-lg bg-muted/30">
      <h4 className="text-sm font-semibold text-center truncate">{label}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tResults('totalTax')}</span>
          <span className="font-mono font-medium">
            {formatCurrency(result.totalDeductions / 12)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tResults('effectiveRate')}</span>
          <span className="font-mono font-medium">
            {formatPercent(result.totalEffectiveRate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tResults('monthlyNet')}</span>
          <span className="font-mono font-medium">
            {formatCurrency((monthlyIncome * 12 - result.totalDeductions) / 12)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tResults('incomeTax')}</span>
          <span className="font-mono">{formatCurrency(result.incomeTax.netTax / 12)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tResults('nationalInsurance')}</span>
          <span className="font-mono">
            {formatCurrency(result.nationalInsurance.employeeContribution / 12)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ScenarioComparison() {
  const t = useTranslations('scenarios');
  const locale = useLocale();
  const { profiles } = useCalculatorStore();
  const [profileAId, setProfileAId] = useState<string | ''>('');
  const [profileBId, setProfileBId] = useState<string | ''>('');

  const profileA = profiles.find((p) => p.id === profileAId);
  const profileB = profiles.find((p) => p.id === profileBId);

  const resultA = useMemo(
    () => (profileA ? computeResult(profileA) : null),
    [profileA]
  );
  const resultB = useMemo(
    () => (profileB ? computeResult(profileB) : null),
    [profileB]
  );

  if (profiles.length < 2) return null;

  const isHe = locale === 'he';
  const diff =
    resultA && resultB ? (resultB.totalDeductions - resultA.totalDeductions) / 12 : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Select value={profileAId} onValueChange={setProfileAId}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder={t('selectA')} />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ArrowLeftRight className="h-4 w-4 text-muted-foreground shrink-0" />

            <Select value={profileBId} onValueChange={setProfileBId}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder={t('selectB')} />
              </SelectTrigger>
              <SelectContent>
                {profiles
                  .filter((p) => p.id !== profileAId)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {resultA && resultB && profileA && profileB && (
            <>
              <div className="flex gap-4">
                <ResultColumn
                  label={profileA.name}
                  result={resultA}
                  monthlyIncome={profileA.monthlyIncome}
                />
                <ResultColumn
                  label={profileB.name}
                  result={resultB}
                  monthlyIncome={profileB.monthlyIncome}
                />
              </div>

              {diff !== null && (
                <div className="mt-4 rounded-lg border p-3 text-center">
                  <span className="text-sm text-muted-foreground">
                    {t('difference')}:{' '}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      diff > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {diff > 0 ? '+' : ''}
                    {formatCurrency(diff)}
                    {isHe ? ' בחודש' : '/mo'}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
