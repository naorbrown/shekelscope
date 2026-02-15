'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from './section-wrapper';
import { TrendingUp, Home, Wallet, ExternalLink } from 'lucide-react';

export function CentralBankSection() {
  const t = useTranslations('sections.centralBank');

  return (
    <SectionWrapper
      id="central-bank"
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
              <TrendingUp className="h-8 w-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">{t('m1Growth')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('m1GrowthLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('m1GrowthDetail')}</p>
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
              <Home className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{t('housingInflation')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('housingInflationLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('housingInflationDetail')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/30">
            <CardContent className="pt-6 text-center">
              <Wallet className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{t('realWages')}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t('realWagesLabel')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('realWagesDetail')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* How it works + Who benefits */}
      <div className="space-y-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">How the hidden tax works</h4>
              <p className="text-sm text-muted-foreground">{t('howItWorks')}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-amber-200/50 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">Who benefits, who loses</h4>
              <p className="text-sm text-muted-foreground">{t('whoBenefits')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Currency manipulation + Supply restriction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-full">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">Currency Manipulation</h4>
              <p className="text-sm text-muted-foreground">{t('currencyManipulation')}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-full">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">Supply Restriction</h4>
              <p className="text-sm text-muted-foreground">{t('supplyRestriction')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Root cause + alternative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-2 justify-center"
      >
        <Button variant="outline" size="sm" asChild>
          <a href={t('actions.boiUrl')} target="_blank" rel="noopener noreferrer" className="gap-2">
            <ExternalLink className="h-3 w-3" />
            {t('actions.boiData')}
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={t('actions.knessetUrl')} target="_blank" rel="noopener noreferrer" className="gap-2">
            <ExternalLink className="h-3 w-3" />
            {t('actions.knessetFinance')}
          </a>
        </Button>
      </motion.div>
    </SectionWrapper>
  );
}
