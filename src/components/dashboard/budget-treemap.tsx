'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import type { BudgetAllocationResult } from '@/lib/tax-engine/types';

interface BudgetTreemapProps {
  budgetAllocation: BudgetAllocationResult[];
  displayMode: 'monthly' | 'annual';
}

interface TreemapNodeData {
  name: string;
  size: number;
  color: string;
  percentage: number;
}

// Custom content renderer for treemap cells
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, color, percentage } = props;

  if (width < 40 || height < 30) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        style={{
          fill: color,
          stroke: 'hsl(var(--background))',
          strokeWidth: 2,
          opacity: 0.9,
        }}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={width > 100 ? 12 : 10}
            fontWeight="600"
          >
            {name && name.length > Math.floor(width / 8)
              ? name.slice(0, Math.floor(width / 8)) + '...'
              : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={10}
          >
            {percentage?.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
}

export function BudgetTreemap({ budgetAllocation, displayMode }: BudgetTreemapProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const divisor = displayMode === 'monthly' ? 12 : 1;

  const data: TreemapNodeData[] = useMemo(
    () =>
      budgetAllocation.map((item) => ({
        name: locale === 'he' ? item.nameHe : item.nameEn,
        size: Math.round(item.amount / divisor),
        color: item.color,
        percentage: item.percentage,
      })),
    [budgetAllocation, locale, divisor]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('treemapTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data as any}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomTreemapContent />}
              >
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
