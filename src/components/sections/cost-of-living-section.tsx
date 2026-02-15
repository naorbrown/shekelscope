'use client';

import { useCallback, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/charts/chart-container';
import { SectionWrapper } from './section-wrapper';
import costData from '@/lib/data/cost-of-living.json';
import { TrendingDown, ShoppingCart, Car } from 'lucide-react';

interface GroupedBarItem {
  item: string;
  country: string;
  value: number;
}

export function CostOfLivingSection() {
  const t = useTranslations('sections.costOfLiving');

  const chartData: GroupedBarItem[] = useMemo(
    () =>
      costData.basketComparisons.flatMap((item) => [
        { item: item.item, country: 'Israel', value: item.israelILS },
        { item: item.item, country: 'Germany', value: item.germanyILS },
        { item: item.item, country: 'USA', value: item.usaILS },
      ]),
    []
  );

  const render = useCallback(
    ({ width }: { width: number; isRTL: boolean }) => {
      return Plot.plot({
        width,
        height: 350,
        marginBottom: 70,
        marginLeft: 50,
        x: {
          label: null,
          tickRotate: -25,
        },
        y: {
          label: null,
          grid: true,
          tickFormat: (v: number) => `₪${v}`,
        },
        color: {
          domain: ['Israel', 'Germany', 'USA'],
          range: ['#ef4444', '#94a3b8', '#3b82f6'],
          legend: true,
        },
        marks: [
          Plot.barY(chartData, {
            x: 'item',
            y: 'value',
            fill: 'country',
            fx: 'item',
            tip: true,
            title: (d: GroupedBarItem) => `${d.country}: ₪${d.value}`,
          }),
          Plot.ruleY([0]),
        ],
      });
    },
    [chartData]
  );

  return (
    <SectionWrapper
      id="cost-of-living"
      title={t('title')}
      subtitle={t('subtitle')}
    >
      {/* Stat highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/30">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">+19%</p>
              <p className="text-sm text-muted-foreground mt-1">{t('foodPremium')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="pt-6 text-center">
              <Car className="h-8 w-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">+100%</p>
              <p className="text-sm text-muted-foreground mt-1">{t('carTax')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30">
            <CardContent className="pt-6 text-center">
              <TrendingDown className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">-80%</p>
              <p className="text-sm text-muted-foreground mt-1">{t('telecomSuccess')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Price comparison chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">{t('comparisonTitle')}</h3>
            <ChartContainer height={350} render={render} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              All prices converted to NIS for comparison
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deregulation proof + root cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-red-200/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">Root Cause</h4>
              <p className="text-sm text-muted-foreground">{t('rootCause')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-emerald-200/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">The Alternative</h4>
              <p className="text-sm text-muted-foreground">{t('alternative')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deregulation proof callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 text-center"
      >
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          {t('deregulationProof')}
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
