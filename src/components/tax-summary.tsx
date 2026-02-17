'use client';

import type { TotalTaxResult } from '@/modules/tax-engine/types';
import { getContent, CONTENT } from '@/content';
import { formatShekel, formatPercent } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TaxSummaryProps {
  result: TotalTaxResult;
}

export function TaxSummary({ result }: TaxSummaryProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">
        {getContent(CONTENT.SECTION_SUMMARY_TITLE)}
      </h2>

      {/* Big numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label={getContent(CONTENT.SUMMARY_MONTHLY_GROSS)}
          value={formatShekel(result.monthlyGross)}
        />
        <StatCard
          label={getContent(CONTENT.SUMMARY_MONTHLY_NET)}
          value={formatShekel(result.monthlyNet)}
          highlight
        />
        <StatCard
          label={getContent(CONTENT.SUMMARY_TOTAL_DEDUCTIONS)}
          value={formatShekel(result.totalDeductions / 12)}
          destructive
        />
        <StatCard
          label={getContent(CONTENT.SUMMARY_EFFECTIVE_RATE)}
          value={formatPercent(result.totalEffectiveRate)}
        />
      </div>

      {/* Daily tax — visceral hook */}
      <Card className="mt-4 border-destructive/30 bg-destructive/5">
        <CardContent className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            {getContent(CONTENT.SUMMARY_DAILY_TAX)}
          </p>
          <p className="text-3xl font-bold text-destructive">
            {formatShekel(result.dailyTax)}{' '}
            <span className="text-base font-normal text-muted-foreground">
              {getContent(CONTENT.SUMMARY_PER_DAY)}
            </span>
          </p>
        </CardContent>
      </Card>

      <Separator className="mt-6" />

      {/* Inline breakdown */}
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <BreakdownLine label={getContent(CONTENT.TAX_INCOME_TAX)} amount={result.incomeTax.netTax / 12} />
        <BreakdownLine label={getContent(CONTENT.TAX_NATIONAL_INSURANCE)} amount={result.nationalInsurance.employeeContribution / 12} />
        <BreakdownLine label={getContent(CONTENT.TAX_HEALTH_TAX)} amount={result.healthTax.contribution / 12} />
        {result.vat && (
          <BreakdownLine label={getContent(CONTENT.TAX_VAT)} amount={result.vat.annualVatPaid / 12} />
        )}
        {result.arnona && (
          <BreakdownLine label={getContent(CONTENT.TAX_ARNONA)} amount={result.arnona.monthlyAmount} />
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight,
  destructive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  destructive?: boolean;
}) {
  return (
    <Card>
      <CardContent className="py-4 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-2xl font-bold ${
            destructive ? 'text-destructive' : highlight ? 'text-primary' : ''
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function BreakdownLine({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-muted/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{formatShekel(amount)}</span>
    </div>
  );
}
