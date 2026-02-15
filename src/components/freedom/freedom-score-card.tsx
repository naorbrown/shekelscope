'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { FreedomScore } from '@/lib/freedom-calculator';

interface FreedomScoreCardProps {
  score: FreedomScore;
}

const GRADE_COLORS: Record<string, string> = {
  A: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  B: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  C: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
  D: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  F: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
};

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}/100</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <motion.div
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function FreedomScoreCard({ score }: FreedomScoreCardProps) {
  const t = useTranslations('freedom.score');

  const gradeColors = GRADE_COLORS[score.grade] || GRADE_COLORS.C;

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
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Overall score circle */}
            <div
              className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${gradeColors}`}
            >
              <span className="font-mono text-3xl font-bold">
                {score.overall}
              </span>
              <span className="text-xs font-medium">{t('overall')}</span>
              <span className="text-lg font-bold mt-0.5">{score.grade}</span>
            </div>

            {/* Sub-scores */}
            <div className="flex-1 w-full space-y-3">
              <ScoreBar
                label={t('taxFreedom')}
                value={score.taxFreedom}
                color="bg-blue-500"
              />
              <ScoreBar
                label={t('purchasingPower')}
                value={score.purchasingPower}
                color="bg-emerald-500"
              />
              <ScoreBar
                label={t('investmentFreedom')}
                value={score.investmentFreedom}
                color="bg-orange-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
