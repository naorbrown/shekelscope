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
  Cell,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './section-wrapper';
import { Home, Clock, MapPin, ExternalLink } from 'lucide-react';
import housingData from '@/lib/data/housing-data.json';

const ISRAEL_COLOR = '#ef4444';
const OTHER_COLOR = '#94a3b8';

export function HousingCrisisSection() {
  const t = useTranslations('sections.housingCrisis');

  const permitData = housingData.permitTimeComparison.map((c) => ({
    name: c.country,
    days: c.days,
    isIsrael: c.country === 'Israel',
  }));

  return (
    <SectionWrapper
      id="housing"
      title={t('title')}
      subtitle={t('subtitle')}
    >
      {/* Three stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="pt-6 text-center">
              <Home className="h-8 w-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">{t('priceToIncome')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('priceToIncomeLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('priceToIncomeDetail')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/30">
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{t('permitTime')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('permitTimeLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('permitTimeDetail')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/30">
            <CardContent className="pt-6 text-center">
              <MapPin className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{t('landControl')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('landControlLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('landControlDetail')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Permit time comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">{t('permitComparisonTitle')}</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={permitData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${v} days`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    width={70}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} days`, '']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                    {permitData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isIsrael ? ISRAEL_COLOR : OTHER_COLOR}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Root cause + alternative */}
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

      {/* Who is responsible + actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <Card className="border-amber-200/50 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-sm mb-3">Who is responsible: {t('whoIsResponsible')}</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={t('actions.housingUrl')} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  {t('actions.contactHousing')}
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={t('actions.ilaUrl')} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  {t('actions.contactILA')}
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://foi.gov.il/" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  {t('actions.fileFOI')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SectionWrapper>
  );
}
