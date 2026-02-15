'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import oecdData from '@/lib/data/oecd-comparison.json';

const ISRAEL_COLOR = '#3b82f6';
const OTHER_COLOR = '#94a3b8';

interface BarDataItem {
  name: string;
  value: number;
  isIsrael: boolean;
}

function ComparisonBarChart({
  data,
  unit,
}: {
  data: BarDataItem[];
  unit: string;
}) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            interval={0}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            tickFormatter={(v) => `${v}${unit}`}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${value}${unit}`, '']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isIsrael ? ISRAEL_COLOR : OTHER_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OECDComparison() {
  const t = useTranslations('dashboard');

  const housingData: BarDataItem[] = useMemo(
    () =>
      oecdData.housingAffordability.countries.map((c) => ({
        name: c.country,
        value: c.priceToIncomeRatio,
        isIsrael: c.country === 'Israel',
      })),
    []
  );

  const efficiencyData: BarDataItem[] = useMemo(() => {
    return [
      { name: 'Israel', value: oecdData.governmentEfficiency.israel, isIsrael: true },
      { name: 'OECD Average', value: oecdData.governmentEfficiency.oecdAverage, isIsrael: false },
    ];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('oecdTitle')}</CardTitle>
          <CardDescription>{t('oecdSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="housing">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="housing">{t('oecdTabs.housing')}</TabsTrigger>
              <TabsTrigger value="efficiency">{t('oecdTabs.efficiency')}</TabsTrigger>
            </TabsList>

            <TabsContent value="housing" className="pt-4">
              <ComparisonBarChart data={housingData} unit="x" />
              <p className="text-muted-foreground text-xs mt-2 text-center">
                Housing price-to-income ratio — higher means less affordable
              </p>
            </TabsContent>

            <TabsContent value="efficiency" className="pt-4">
              <ComparisonBarChart data={efficiencyData} unit="" />
              <p className="text-muted-foreground text-xs mt-2 text-center">
                Government Effectiveness Score (0-100) — {oecdData.governmentEfficiency.source}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
