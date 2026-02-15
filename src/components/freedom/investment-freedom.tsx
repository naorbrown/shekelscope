'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import freedomData from '@/lib/data/freedom-analysis.json';
import type { InvestmentFreedomResult } from '@/lib/freedom-calculator';

interface InvestmentFreedomProps {
  investmentResult: InvestmentFreedomResult;
  annualInvestable: number;
}

export function InvestmentFreedom({
  investmentResult,
  annualInvestable,
}: InvestmentFreedomProps) {
  const t = useTranslations('freedom.investment');

  const israelRates = freedomData.capitalGainsTax.israel;
  const internationalRates = freedomData.capitalGainsTax.international;
  const tase = freedomData.taseRestrictions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10 space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold mb-1">{t('title')}</h3>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Israel's rates */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">{t('israelRates')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('standard'), rate: israelRates.standard },
              {
                label: t('significantShareholder'),
                rate: israelRates.significantShareholder,
              },
              { label: t('dividends'), rate: israelRates.dividends },
              { label: t('interestIncome'), rate: israelRates.interestIncome },
              { label: t('crypto'), rate: israelRates.crypto },
              {
                label: t('foreignInvestments'),
                rate: israelRates.foreignInvestments,
              },
              {
                label: t('realEstate'),
                rate: israelRates.realEstateAppreciation,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-mono text-lg font-bold text-red-700 dark:text-red-300">
                  {item.rate}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* International comparison */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <h4 className="font-semibold mb-3">{t('capitalGains')}</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-start py-2 font-medium">{t('country')}</th>
                <th className="text-end py-2 font-medium">{t('shortTerm')}</th>
                <th className="text-end py-2 font-medium">{t('longTerm')}</th>
                <th className="text-start py-2 ps-4 font-medium">
                  {t('notes')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-red-50/50 dark:bg-red-950/20">
                <td className="py-2 font-medium">Israel</td>
                <td className="text-end py-2 font-mono font-bold text-red-600 dark:text-red-400">
                  {israelRates.standard}%
                </td>
                <td className="text-end py-2 font-mono font-bold text-red-600 dark:text-red-400">
                  {israelRates.standard}%
                </td>
                <td className="py-2 ps-4 text-xs text-muted-foreground">
                  No preferential long-term rate
                </td>
              </tr>
              {internationalRates.map((country) => (
                <tr key={country.country} className="border-b last:border-b-0">
                  <td className="py-2">{country.country}</td>
                  <td
                    className={`text-end py-2 font-mono ${country.shortTerm === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}
                  >
                    {country.shortTerm}%
                  </td>
                  <td
                    className={`text-end py-2 font-mono ${country.longTerm === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}
                  >
                    {country.longTerm}%
                  </td>
                  <td className="py-2 ps-4 text-xs text-muted-foreground">
                    {country.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* TASE restrictions */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">{t('taseTitle')}</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('taseListedCompanies')}
              </p>
              <p className="font-mono text-lg font-bold">
                {tase.numberOfListedCompanies}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('taseMarketCap')}
              </p>
              <p className="font-mono text-lg font-bold">
                ${tase.marketCapBillionUSD}B
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {t('taseDailyVolume')}
              </p>
              <p className="font-mono text-lg font-bold">
                ${tase.averageDailyVolumeBillionUSD}B
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t('taseIssues')}</p>
        </CardContent>
      </Card>

      {/* Alternative assets */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">{t('altAssetsTitle')}</h4>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="font-medium text-sm">{t('crypto')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('cryptoDesc')}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium text-sm">{t('foreignInvestments')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('foreignStocksDesc')}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium text-sm">{t('realEstate')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('realEstateDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 10-year compound effect */}
      <Card className="border-orange-200 dark:border-orange-900">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-1">{t('compoundTitle')}</h4>
          <p className="text-xs text-muted-foreground mb-4">
            {t('compoundDesc', {
              amount: formatCurrency(Math.round(annualInvestable)),
            })}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                {t('currentScenario')}
              </p>
              <p className="font-mono text-xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(investmentResult.compoundEffect10yr.currentValue)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                {t('reformedScenario')}
              </p>
              <p className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(
                  investmentResult.compoundEffect10yr.reformedValue
                )}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-center text-orange-700 dark:text-orange-300">
            {t('youLose', {
              amount: formatCurrency(
                investmentResult.compoundEffect10yr.difference
              ),
            })}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
