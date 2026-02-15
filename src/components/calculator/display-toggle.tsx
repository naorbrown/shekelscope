'use client';

import { useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Button } from '@/components/ui/button';

export function DisplayToggle() {
  const t = useTranslations('calculator');
  const { displayMode, setDisplayMode, hasCalculated } = useCalculatorStore();

  if (!hasCalculated) return null;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1">
      <Button
        variant={displayMode === 'monthly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setDisplayMode('monthly')}
      >
        {t('monthly')}
      </Button>
      <Button
        variant={displayMode === 'annual' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setDisplayMode('annual')}
      >
        {t('annual')}
      </Button>
    </div>
  );
}
