'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import type { TotalTaxResult } from '@/lib/tax-engine/types';

interface TaxDonutProps {
  result: TotalTaxResult;
  displayMode: 'monthly' | 'annual';
}

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6'];

interface SliceData {
  name: string;
  value: number;
  color: string;
}

export function TaxDonut({ result, displayMode }: TaxDonutProps) {
  const t = useTranslations('dashboard');
  const tResults = useTranslations('results');
  const locale = useLocale();

  const divisor = displayMode === 'monthly' ? 12 : 1;

  const data: SliceData[] = useMemo(() => {
    const slices: SliceData[] = [
      {
        name: tResults('incomeTax'),
        value: Math.round(result.incomeTax.netTax / divisor),
        color: COLORS[0],
      },
      {
        name: tResults('nationalInsurance'),
        value: Math.round(result.nationalInsurance.employeeContribution / divisor),
        color: COLORS[1],
      },
      {
        name: tResults('healthTax'),
        value: Math.round(result.healthTax.contribution / divisor),
        color: COLORS[2],
      },
    ];

    if (result.vat) {
      slices.push({
        name: tResults('vatEstimate'),
        value: Math.round(result.vat.annualVatPaid / divisor),
        color: COLORS[3],
      });
    }

    return slices.filter((s) => s.value > 0);
  }, [result, divisor, tResults]);

  const totalTax = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('donutTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative h-[280px] w-full max-w-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value)),
                      String(name),
                    ]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-xs">
                  {displayMode === 'monthly' ? tResults('totalTaxMonthly') : tResults('totalTaxAnnual')}
                </p>
                <p className="text-xl font-bold">{formatCurrency(totalTax)}</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                {tResults('effectiveRate')}
              </p>
              <p className="text-2xl font-bold">
                {formatPercent(result.totalEffectiveRate)}
              </p>
            </div>

            <div className={`mt-4 grid grid-cols-2 gap-3 w-full ${locale === 'he' ? 'text-right' : 'text-left'}`}>
              {data.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md p-2"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
