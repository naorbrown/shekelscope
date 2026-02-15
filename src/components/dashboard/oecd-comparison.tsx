'use client';

import { useCallback, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/charts/chart-container';
import { DataSourceBadge } from '@/components/shared/data-source-badge';
import { useOECDData, useOECDTimeSeries } from '@/lib/data/fetchers';
import { TimeSeriesComparison } from '@/components/charts/time-series-comparison';

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
  const render = useCallback(
    ({ width }: { width: number; isRTL: boolean }) => {
      return Plot.plot({
        width,
        height: 300,
        marginBottom: 60,
        marginLeft: 50,
        x: {
          label: null,
          tickRotate: -25,
          domain: data.map((d) => d.name),
        },
        y: {
          label: null,
          grid: true,
          tickFormat: (v: number) => `${v}${unit}`,
        },
        marks: [
          Plot.barY(data, {
            x: 'name',
            y: 'value',
            fill: (d: BarDataItem) => (d.isIsrael ? ISRAEL_COLOR : OTHER_COLOR),
            tip: true,
            title: (d: BarDataItem) => `${d.name}: ${d.value}${unit}`,
          }),
          Plot.ruleY([0]),
        ],
      });
    },
    [data, unit]
  );

  return <ChartContainer height={300} render={render} />;
}

export function OECDComparison() {
  const t = useTranslations('dashboard');
  const { data: result } = useOECDData();
  const { data: timeseriesResult } = useOECDTimeSeries();

  const oecdData = result?.data;
  const tsData = timeseriesResult?.data;

  const housingData: BarDataItem[] = useMemo(
    () =>
      oecdData
        ? oecdData.housingAffordability.countries.map((c) => ({
            name: c.country,
            value: c.priceToIncomeRatio,
            isIsrael: c.country === 'Israel',
          }))
        : [],
    [oecdData]
  );

  const efficiencyData: BarDataItem[] = useMemo(() => {
    if (!oecdData) return [];
    return [
      { name: 'Israel', value: oecdData.governmentEfficiency.israel, isIsrael: true },
      { name: 'OECD Average', value: oecdData.governmentEfficiency.oecdAverage, isIsrael: false },
    ];
  }, [oecdData]);

  if (!oecdData) return null;

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
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="housing">{t('oecdTabs.housing')}</TabsTrigger>
              <TabsTrigger value="efficiency">{t('oecdTabs.efficiency')}</TabsTrigger>
              <TabsTrigger value="taxTrend">{t('oecdTabs.taxTrend')}</TabsTrigger>
              <TabsTrigger value="healthTrend">{t('oecdTabs.healthTrend')}</TabsTrigger>
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

            <TabsContent value="taxTrend" className="pt-4">
              {tsData && (
                <TimeSeriesComparison
                  data={tsData.taxToGDP}
                  unit="%"
                />
              )}
              <p className="text-muted-foreground text-xs mt-2 text-center">
                {t('oecdTabs.taxTrendCaption')}
              </p>
            </TabsContent>

            <TabsContent value="healthTrend" className="pt-4">
              {tsData && (
                <TimeSeriesComparison
                  data={tsData.healthSpendingPerCapita}
                  unit="$"
                />
              )}
              <p className="text-muted-foreground text-xs mt-2 text-center">
                {t('oecdTabs.healthTrendCaption')}
              </p>
            </TabsContent>
          </Tabs>

          {result && (
            <DataSourceBadge
              source={result.source}
              sourceUrl={result.sourceUrl}
              lastUpdated={result.lastUpdated}
              isLive={result.isLive}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
