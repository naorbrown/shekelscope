'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { SectionWrapper } from './section-wrapper';
import costData from '@/lib/data/cost-of-living.json';
import { TrendingDown, ShoppingCart, Car } from 'lucide-react';

export function CostOfLivingSection() {
  const t = useTranslations('sections.costOfLiving');

  const chartData = costData.basketComparisons.map((item) => ({
    name: item.item,
    Israel: item.israelILS,
    Germany: item.germanyILS,
    USA: item.usaILS,
  }));

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
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    className="fill-muted-foreground"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `₪${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`₪${value}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="Israel" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Germany" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="USA" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
