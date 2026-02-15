'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import arnonaData from '@/lib/data/arnona-rates.json';

export function TaxForm() {
  const t = useTranslations('calculator');
  const store = useCalculatorStore();
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.calculate();
    router.push(`/${locale}/results`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      {/* Salary Input — large, prominent, search-bar style */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
          <span className="text-2xl font-bold text-muted-foreground">₪</span>
        </div>
        <Input
          id="income"
          type="number"
          min={0}
          step={100}
          placeholder="13,316"
          value={store.monthlyIncome || ''}
          onChange={(e) => store.setMonthlyIncome(Number(e.target.value))}
          className="h-16 ps-12 pe-4 text-2xl font-mono rounded-xl border-2 border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
          dir="ltr"
          aria-label={t('monthlyIncome')}
        />
      </div>

      {/* City Dropdown — compact, inline */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          id="city"
          name="city"
          value={store.selectedCity || ''}
          onChange={(e) => store.setSelectedCity(e.target.value || null)}
          className="flex-1 h-12 rounded-xl border-2 border-input bg-background px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
        >
          <option value="">{t('selectCity')}</option>
          {arnonaData.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.nameEn} / {city.nameHe}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          className="h-12 px-8 text-base rounded-xl sm:w-auto"
          disabled={store.monthlyIncome <= 0}
        >
          <Search className="h-4 w-4 me-2" />
          {t('calculate')}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t('subtitle')}
      </p>
    </form>
  );
}
