'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/components/shared/currency-display';
import type { TotalTaxResult } from '@/lib/tax-engine/types';

interface DailyReceiptProps {
  result: TotalTaxResult;
}

export function DailyReceipt({ result }: DailyReceiptProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const dailyAllocations = result.budgetAllocation.map((item) => ({
    ...item,
    dailyAmount: item.amount / 365,
    name: locale === 'he' ? item.nameHe : item.nameEn,
  }));

  const totalDaily = result.dailyTax;

  const buildShareText = useCallback(() => {
    const lines = [
      `${t('receiptTitle')} - ShekelScope`,
      `${t('receiptSubtitle')}: ${formatCurrency(totalDaily, true)}`,
      '',
      ...dailyAllocations.map(
        (a) => `${a.name}: ${formatCurrency(a.dailyAmount, true)}`
      ),
      '',
      'https://shekelscope.com',
    ];
    return lines.join('\n');
  }, [t, totalDaily, dailyAllocations]);

  const handleShare = useCallback(async () => {
    const text = buildShareText();

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'ShekelScope - Daily Tax Receipt',
          text,
        });
        return;
      } catch {
        // User cancelled or share failed -- fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard also failed -- ignore
    }
  }, [buildShareText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden">
        {/* Receipt header with dashed border look */}
        <div className="border-b-2 border-dashed border-muted-foreground/20">
          <CardHeader className="text-center">
            <CardTitle className="font-mono text-lg tracking-wide uppercase">
              {t('receiptTitle')}
            </CardTitle>
            <CardDescription className="font-mono">
              {t('receiptSubtitle')}
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="pt-4">
          {/* Total daily tax at the top */}
          <div className="mb-4 rounded-lg bg-muted/50 p-3 text-center">
            <p className="font-mono text-3xl font-bold">
              {formatCurrency(totalDaily, true)}
            </p>
            <p className="text-muted-foreground font-mono text-xs mt-1">
              {t('receiptSubtitle')}
            </p>
          </div>

          {/* Line items */}
          <div className="space-y-1 font-mono text-sm">
            {dailyAllocations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: locale === 'he' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="flex items-center justify-between py-1.5 border-b border-dotted border-muted-foreground/15 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate max-w-[180px]">{item.name}</span>
                </div>
                <span className="font-medium tabular-nums">
                  {formatCurrency(item.dailyAmount, true)}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Total line */}
          <div className="mt-3 pt-3 border-t-2 border-dashed border-muted-foreground/30 flex justify-between font-mono font-bold">
            <span>TOTAL</span>
            <span className="tabular-nums">{formatCurrency(totalDaily, true)}</span>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t-2 border-dashed border-muted-foreground/20 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2 font-mono"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="size-4" />
                {t('shareReceipt')}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
