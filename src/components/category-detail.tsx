'use client';

import { useState } from 'react';
import type { BudgetNarrativesData } from '@/modules/data/types';
import type { EfficiencyResult } from '@/modules/efficiency/types';
import { getContent, CONTENT } from '@/content';
import { formatShekel } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type CategoryNarrative = BudgetNarrativesData['categories'][string];

interface CategoryDetailProps {
  narrative: CategoryNarrative;
  efficiency: EfficiencyResult | null;
  monthlyAmount: number;
}

export function CategoryDetail({ narrative, efficiency, monthlyAmount }: CategoryDetailProps) {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="space-y-4 text-sm">
      <Separator />

      {/* What you're paying for */}
      <div>
        <h4 className="font-semibold text-muted-foreground">
          {getContent(CONTENT.CATEGORY_WHAT_YOU_PAY)}
        </h4>
        <p className="mt-1">{narrative.whatYouPay.en}</p>
      </div>

      {/* Ministry info */}
      <div className="rounded-md bg-muted/50 p-3">
        <p className="font-medium">{narrative.ministry.nameEn}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>{narrative.ministry.employees.toLocaleString()} {getContent(CONTENT.CATEGORY_EMPLOYEES)}</span>
          <span>{formatShekel(narrative.ministry.avgSalaryMonthly)} {getContent(CONTENT.CATEGORY_AVG_SALARY)}</span>
        </div>
      </div>

      {/* Problems */}
      <div>
        <h4 className="font-semibold text-destructive">
          {getContent(CONTENT.CATEGORY_PROBLEMS)}
        </h4>
        <ul className="mt-2 space-y-3">
          {narrative.problems.map((problem, i) => (
            <li key={i} className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{problem.title.en}</p>
                {problem.stat && (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {problem.stat}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">{problem.detail.en}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* A better system */}
      <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
        <h4 className="font-semibold text-primary">
          {getContent(CONTENT.CATEGORY_BETTER_SYSTEM)}
        </h4>
        <p className="mt-1">{narrative.betterSystem.en}</p>
      </div>

      {/* Efficiency summary */}
      {efficiency && efficiency.potentialSavings > 0 && (
        <p className="text-xs text-muted-foreground">
          If run at market rates, this category would cost{' '}
          <span className="font-semibold text-primary">
            {formatShekel(efficiency.alternativeCost / 12)}/mo
          </span>{' '}
          instead of {formatShekel(monthlyAmount)}/mo — a potential savings of{' '}
          <span className="font-semibold text-primary">
            {formatShekel(efficiency.potentialSavings / 12)}/mo
          </span>
          .
        </p>
      )}

      {/* Category-specific actions */}
      <div>
        <h4 className="font-semibold">{getContent(CONTENT.CATEGORY_ACTIONS)}</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {narrative.actions.map((action, i) => (
            <a
              key={i}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {action.labelEn}
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div>
        <button
          type="button"
          onClick={() => setShowSources(!showSources)}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {getContent(CONTENT.CATEGORY_SOURCES)} ({narrative.sources.length})
        </button>
        {showSources && (
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {narrative.sources.map((source, i) => (
              <li key={i}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-1.5"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
