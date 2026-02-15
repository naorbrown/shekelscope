'use client';

import { useTranslations } from 'next-intl';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export function TaxForm() {
  const t = useTranslations('calculator');
  const store = useCalculatorStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.calculate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Income */}
          <div className="space-y-2">
            <Label htmlFor="income">{t('monthlyIncome')}</Label>
            <Input
              id="income"
              type="number"
              min={0}
              step={100}
              placeholder="15,000"
              value={store.monthlyIncome || ''}
              onChange={(e) => store.setMonthlyIncome(Number(e.target.value))}
              className="text-lg font-mono"
              dir="ltr"
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <Label>{t('employmentType')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={store.employmentType === 'employee' ? 'default' : 'outline'}
                onClick={() => store.setEmploymentType('employee')}
                className="flex-1"
              >
                {t('employee')}
              </Button>
              <Button
                type="button"
                variant={store.employmentType === 'selfEmployed' ? 'default' : 'outline'}
                onClick={() => store.setEmploymentType('selfEmployed')}
                className="flex-1"
              >
                {t('selfEmployed')}
              </Button>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>{t('gender')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={store.gender === 'male' ? 'default' : 'outline'}
                onClick={() => store.setGender('male')}
                className="flex-1"
              >
                {t('male')}
              </Button>
              <Button
                type="button"
                variant={store.gender === 'female' ? 'default' : 'outline'}
                onClick={() => store.setGender('female')}
                className="flex-1"
              >
                {t('female')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Advanced Options */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t('advancedOptions')}
            <span className="text-lg">{showAdvanced ? '−' : '+'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Children */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t('children')}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => store.addChild()}
                  >
                    {t('addChild')}
                  </Button>
                </div>
                {store.childAges.map((age, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Label className="min-w-fit text-sm text-muted-foreground">
                      {t('childAge')}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={18}
                      value={age}
                      onChange={(e) => store.setChildAge(i, Number(e.target.value))}
                      className="w-20 font-mono"
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => store.removeChild(i)}
                      className="text-destructive"
                    >
                      {t('removeChild')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={store.monthlyIncome <= 0}
          >
            {t('calculate')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
