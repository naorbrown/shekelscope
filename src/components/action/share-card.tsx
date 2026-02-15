'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Copy, Check } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

export function ShareCard() {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const canShare = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return typeof navigator.share === 'function';
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + `/${locale}` : '';
  const shareTitle = locale === 'he'
    ? 'שקל סקופ - לאן הולך הכסף שלך?'
    : 'ShekelScope - Where does YOUR money go?';
  const shareText = locale === 'he'
    ? 'גלו בדיוק לאן הולך כל שקל מהמסים שלכם.'
    : 'See exactly where every shekel of your taxes goes.';

  const handleShare = useCallback(async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [canShare, shareTitle, shareText, shareUrl]);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
        <p className="text-sm font-medium text-foreground">
          {locale === 'he' ? 'שתפו את שקל סקופ עם חברים ומשפחה' : 'Share ShekelScope with friends and family'}
        </p>
        <Button onClick={handleShare} variant="default" size="sm">
          {copied ? (
            <>
              <Check className="size-4" />
              {locale === 'he' ? 'הועתק!' : 'Copied!'}
            </>
          ) : canShare ? (
            <>
              <Share2 className="size-4" />
              {locale === 'he' ? 'שתפו' : 'Share'}
            </>
          ) : (
            <>
              <Copy className="size-4" />
              {locale === 'he' ? 'העתיקו קישור' : 'Copy Link'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
