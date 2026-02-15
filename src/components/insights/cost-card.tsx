'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/components/shared/currency-display';
import type { EfficiencyResult } from '@/lib/efficiency-analyzer';
import type { CategoryAnalysis } from '@/lib/data/types';
import type { BudgetAllocationResult } from '@/lib/tax-engine/types';
import { ExternalLink } from 'lucide-react';

const gradeColors: Record<string, string> = {
  A: 'bg-emerald-600 text-white',
  B: 'bg-emerald-500 text-white',
  C: 'bg-yellow-500 text-white',
  D: 'bg-orange-500 text-white',
  F: 'bg-red-600 text-white',
  'N/A': 'bg-muted text-muted-foreground',
};

interface CostCardProps {
  efficiency: EfficiencyResult;
  allocation: BudgetAllocationResult;
  analysis: CategoryAnalysis | undefined;
  index: number;
}

export function CostCard({ efficiency, allocation, analysis, index }: CostCardProps) {
  const t = useTranslations('insights.perMinistry');
  const ct = useTranslations('costAnalysis');
  const locale = useLocale();

  const name = locale === 'he' ? allocation.nameHe : allocation.nameEn;
  const servicePercent = efficiency.yourContribution > 0
    ? Math.round((efficiency.reachesService / efficiency.yourContribution) * 100)
    : 0;
  const overheadPercent = 100 - servicePercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{name}</CardTitle>
            <Badge className={gradeColors[efficiency.grade] || gradeColors['N/A']}>
              {efficiency.grade}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('yourContribution')}: <span className="font-mono font-semibold text-foreground">{formatCurrency(efficiency.yourContribution)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stacked progress bar */}
          <div className="space-y-1.5">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <motion.div
                className="bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${servicePercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
              />
              <motion.div
                className="bg-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${overheadPercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(servicePercent))} of your {formatCurrency(100)} {t('reachesService').toLowerCase()}
            </p>
          </div>

          {/* Issues */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Issues</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ct(`${allocation.id}.issues`)}
            </p>
          </div>

          {/* Alternative */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Alternative</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ct(`${allocation.id}.alternative`)}
            </p>
          </div>

          {/* Root Cause */}
          <div className="rounded-md bg-orange-50 p-2.5 dark:bg-orange-950/30">
            <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Root Cause</p>
            <p className="text-xs text-orange-600 dark:text-orange-300 leading-relaxed">
              {ct(`${allocation.id}.rootCause`)}
            </p>
          </div>

          {/* Savings */}
          {efficiency.potentialSavings > 0 && (
            <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{t('savings')}</span>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(efficiency.potentialSavings)}
              </span>
            </div>
          )}

          {/* Sources */}
          {analysis && analysis.sources.length > 0 && (
            <div className="space-y-1 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground">{t('sources')}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {source.name}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
