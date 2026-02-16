'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/components/shared/currency-display';
import { motion } from 'framer-motion';
import { ExternalLink, Share2, MessageSquare, MapPin, Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import narratives from '@/lib/data/budget-narratives.json';

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

type CategoryNarrative = {
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

const narrativeData = narratives as unknown as {
  categories: Record<string, CategoryNarrative>;
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

export function BudgetOverview() {
  const t = useTranslations('results');
  const bt = useTranslations('budget');
  const locale = useLocale();
  const { result, completedActions, toggleAction } = useCalculatorStore();

  if (!result) return null;

  const d = 12;
  const sorted = [...result.budgetAllocation].sort((a, b) => b.amount - a.amount);
  const isHe = locale === 'he';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('budgetBreakdown')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('budgetClickHint')}
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-1">
            {sorted.map((item) => {
              const maxAmount = sorted[0].amount;
              const barWidth = (item.amount / maxAmount) * 100;
              const narrative = narrativeData.categories?.[item.id];

              return (
                <AccordionItem key={item.id} value={item.id} className="border-b-0">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex w-full flex-col gap-1 pe-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{bt(item.id)}</span>
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
                  </AccordionTrigger>
                  <AccordionContent>
                    {narrative ? (
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
                                  {narrative.ministry.employees.toLocaleString()} {isHe ? 'עובדים' : 'employees'}
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {narrative.ministry.employees.toLocaleString()} {isHe ? 'עובדים' : 'employees'}
                                </span>
                              )}
                              {narrative.ministry.avgSalaryMonthly && (
                                <span>
                                  {isHe ? 'שכר ממוצע: ' : 'Avg salary: '}
                                  {formatCurrency(narrative.ministry.avgSalaryMonthly)}{isHe ? '/חודש' : '/mo'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* What You're Paying For */}
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            {isHe ? 'על מה אתם משלמים' : 'What You\'re Paying For'}
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
                              <div key={i} className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
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
                              const actionId = `budget.${item.id}.${action.type}.${i}`;
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
                                      {isCompleted && <Check className="size-3 text-green-600" />}
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
                                      {isCompleted && <Check className="size-3 text-green-600" />}
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
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        {isHe
                          ? 'מידע מפורט יתווסף בקרוב.'
                          : 'Detailed information coming soon.'}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
