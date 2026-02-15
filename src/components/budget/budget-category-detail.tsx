'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Share2, MessageSquare, MapPin, Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import type { BudgetAllocationResult } from '@/lib/tax-engine/types';
import type { EfficiencyResult } from '@/lib/efficiency-analyzer';
import type { CompletedAction } from '@/lib/store/types';

type NarrativeAction = {
  type: string;
  labelEn: string;
  labelHe: string;
  detailEn?: string;
  detailHe?: string;
  url?: string;
};

type NarrativeProblem = {
  title: { en: string; he: string };
  detail: { en: string; he: string };
  stat?: string;
};

export type CategoryNarrative = {
  ministry: {
    nameEn: string;
    nameHe: string;
    website: string;
    contactUrl?: string;
    employees?: number;
    avgSalaryMonthly?: number;
    employeeSourceUrl?: string;
  };
  whatYouPay: { en: string; he: string };
  problems: NarrativeProblem[];
  betterSystem: { en: string; he: string };
  actions: NarrativeAction[];
  sources: { name: string; url: string }[];
};

function ActionIcon({ type }: { type: string }) {
  switch (type) {
    case 'contact':
      return <MessageSquare className="h-4 w-4" />;
    case 'share':
      return <Share2 className="h-4 w-4" />;
    case 'local':
      return <MapPin className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
}

const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' },
  B: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  C: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/30' },
  D: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
  F: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
  'N/A': { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground/30' },
};

interface BudgetCategoryDetailProps {
  category: BudgetAllocationResult;
  efficiency: EfficiencyResult | undefined;
  narrative: CategoryNarrative | undefined;
  completedActions: CompletedAction[];
  toggleAction: (actionId: string) => void;
}

export function BudgetCategoryDetail({
  category,
  efficiency,
  narrative,
  completedActions,
  toggleAction,
}: BudgetCategoryDetailProps) {
  const locale = useLocale();
  const t = useTranslations('results');
  const isHe = locale === 'he';

  if (!narrative) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        {isHe
          ? 'מידע מפורט יתווסף בקרוב.'
          : 'Detailed information coming soon.'}
      </p>
    );
  }

  const grade = efficiency?.grade ?? 'N/A';
  const gradeStyle = GRADE_COLORS[grade] ?? GRADE_COLORS['N/A'];
  const overheadPct =
    efficiency && efficiency.yourContribution > 0
      ? efficiency.estimatedOverhead / efficiency.yourContribution
      : 0;
  const reachesPct =
    efficiency && efficiency.yourContribution > 0
      ? efficiency.reachesService / efficiency.yourContribution
      : 0;

  return (
    <div className="space-y-4 pt-2 pb-4">
      {/* Ministry Info */}
      <div className="rounded-md border bg-muted/30 p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {isHe ? narrative.ministry.nameHe : narrative.ministry.nameEn}
          </span>
          <a
            href={narrative.ministry.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
          >
            <ExternalLink className="h-3 w-3" />
            {isHe ? 'אתר המשרד' : 'Website'}
          </a>
        </div>
        {narrative.ministry.employees && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {narrative.ministry.employeeSourceUrl ? (
              <a
                href={narrative.ministry.employeeSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline hover:text-foreground"
              >
                <Users className="h-3 w-3" />
                {narrative.ministry.employees.toLocaleString()}{' '}
                {isHe ? 'עובדים' : 'employees'}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {narrative.ministry.employees.toLocaleString()}{' '}
                {isHe ? 'עובדים' : 'employees'}
              </span>
            )}
            {narrative.ministry.avgSalaryMonthly && (
              <span>
                {isHe ? 'שכר ממוצע: ' : 'Avg salary: '}
                {formatCurrency(narrative.ministry.avgSalaryMonthly)}
                {isHe ? '/חודש' : '/mo'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Efficiency Strip */}
      {efficiency && grade !== 'N/A' && (
        <div
          className={`rounded-md border ${gradeStyle.border} p-3 grid grid-cols-4 gap-2 text-center text-xs`}
        >
          <div>
            <div className="text-muted-foreground">
              {isHe ? 'ציון' : 'Grade'}
            </div>
            <div className={`text-lg font-bold ${gradeStyle.text}`}>
              {grade}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">{t('overhead')}</div>
            <div className="font-bold text-red-600 dark:text-red-400">
              {formatPercent(overheadPct)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">{t('reachesService')}</div>
            <div className="font-bold text-green-600 dark:text-green-400">
              {formatPercent(reachesPct)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">
              {t('potentialSavings')}
            </div>
            <div className="font-bold">
              {efficiency.potentialSavings > 0
                ? formatCurrency(efficiency.potentialSavings)
                : '—'}
            </div>
          </div>
        </div>
      )}

      {/* What You're Paying For */}
      <div>
        <h4 className="text-sm font-semibold mb-1">
          {isHe ? 'על מה אתם משלמים' : "What You're Paying For"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {isHe ? narrative.whatYouPay.he : narrative.whatYouPay.en}
        </p>
      </div>

      {/* The Problems */}
      <div>
        <h4 className="text-sm font-semibold mb-2">
          {isHe ? 'הבעיות' : 'The Problems'}
        </h4>
        <div className="space-y-2">
          {narrative.problems.map((p, i) => (
            <div
              key={i}
              className="rounded-md border border-destructive/20 bg-destructive/5 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">
                    {isHe ? p.title.he : p.title.en}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isHe ? p.detail.he : p.detail.en}
                  </div>
                </div>
                {p.stat && (
                  <span className="shrink-0 rounded bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                    {p.stat}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A Better System */}
      <div>
        <h4 className="text-sm font-semibold mb-1">
          {isHe ? 'מערכת טובה יותר' : 'A Better System'}
        </h4>
        <div className="rounded-md border border-accent/30 bg-accent/5 p-3 text-sm text-muted-foreground">
          {isHe ? narrative.betterSystem.he : narrative.betterSystem.en}
        </div>
      </div>

      {/* Take Action */}
      <div>
        <h4 className="text-sm font-semibold mb-2">
          {isHe ? 'פעלו עכשיו' : 'Take Action'}
        </h4>
        <div className="space-y-2">
          {narrative.actions.map((action, i) => {
            const actionId = `budget.${category.id}.${action.type}.${i}`;
            const isCompleted = completedActions.some(
              (a) => a.actionId === actionId
            );

            return (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-md border p-2 transition-colors ${
                  isCompleted
                    ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30'
                    : 'bg-background'
                }`}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleAction(actionId)}
                />
                {action.url ? (
                  <a
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-xs hover:underline ${
                      isCompleted
                        ? 'text-green-700 dark:text-green-300 line-through'
                        : ''
                    }`}
                  >
                    <ActionIcon type={action.type} />
                    {isHe ? action.labelHe : action.labelEn}
                    {isCompleted && (
                      <Check className="size-3 text-green-600" />
                    )}
                  </a>
                ) : (
                  <span
                    className={`inline-flex items-center gap-2 text-xs ${
                      isCompleted
                        ? 'text-green-700 dark:text-green-300 line-through'
                        : ''
                    }`}
                  >
                    <ActionIcon type={action.type} />
                    {isHe ? action.labelHe : action.labelEn}
                    {isCompleted && (
                      <Check className="size-3 text-green-600" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources */}
      {narrative.sources.length > 0 && (
        <div className="border-t pt-2">
          <div className="text-xs text-muted-foreground">
            {isHe ? 'מקורות: ' : 'Sources: '}
            {narrative.sources.map((s, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {s.name}
                </a>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
