'use client';

import { useCalculatorStore } from '@/modules/store';
import { getContent, CONTENT } from '@/content';
import type { ArnonaRatesData } from '@/modules/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface SalaryInputProps {
  cities: ArnonaRatesData['cities'];
  onCalculated: () => void;
}

export function SalaryInput({ cities, onCalculated }: SalaryInputProps) {
  const inputs = useCalculatorStore((s) => s.inputs);
  const setMonthlyIncome = useCalculatorStore((s) => s.setMonthlyIncome);
  const setEmploymentType = useCalculatorStore((s) => s.setEmploymentType);
  const setGender = useCalculatorStore((s) => s.setGender);
  const addChild = useCalculatorStore((s) => s.addChild);
  const removeChild = useCalculatorStore((s) => s.removeChild);
  const setChildAge = useCalculatorStore((s) => s.setChildAge);
  const setSelectedCity = useCalculatorStore((s) => s.setSelectedCity);
  const calculate = useCalculatorStore((s) => s.calculate);
  const reset = useCalculatorStore((s) => s.reset);

  const handleCalculate = () => {
    calculate();
    onCalculated();
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{getContent(CONTENT.APP_TITLE)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Income */}
          <div className="space-y-2">
            <label htmlFor="income" className="text-sm font-medium">
              {getContent(CONTENT.INPUT_MONTHLY_INCOME)}
            </label>
            <Input
              id="income"
              type="number"
              dir="ltr"
              min={0}
              step={100}
              value={inputs.monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="font-mono text-lg"
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {getContent(CONTENT.INPUT_EMPLOYMENT_TYPE)}
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputs.employmentType === 'employee' ? 'default' : 'outline'}
                onClick={() => setEmploymentType('employee')}
                className="flex-1"
              >
                {getContent(CONTENT.EMPLOYMENT_EMPLOYEE)}
              </Button>
              <Button
                type="button"
                variant={inputs.employmentType === 'selfEmployed' ? 'default' : 'outline'}
                onClick={() => setEmploymentType('selfEmployed')}
                className="flex-1"
              >
                {getContent(CONTENT.EMPLOYMENT_SELF_EMPLOYED)}
              </Button>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {getContent(CONTENT.INPUT_GENDER)}
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputs.gender === 'male' ? 'default' : 'outline'}
                onClick={() => setGender('male')}
                className="flex-1"
              >
                {getContent(CONTENT.GENDER_MALE)}
              </Button>
              <Button
                type="button"
                variant={inputs.gender === 'female' ? 'default' : 'outline'}
                onClick={() => setGender('female')}
                className="flex-1"
              >
                {getContent(CONTENT.GENDER_FEMALE)}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Children */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {getContent(CONTENT.INPUT_CHILDREN)}
              </label>
              <Button type="button" variant="outline" size="sm" onClick={addChild}>
                + {getContent(CONTENT.INPUT_ADD_CHILD)}
              </Button>
            </div>
            {inputs.childAges.map((age, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground min-w-[60px]">
                  Child {i + 1}
                </span>
                <Input
                  type="number"
                  dir="ltr"
                  min={0}
                  max={18}
                  value={age}
                  onChange={(e) => setChildAge(i, Number(e.target.value))}
                  className="w-20 font-mono"
                  placeholder={getContent(CONTENT.INPUT_CHILD_AGE)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChild(i)}
                  className="text-destructive"
                >
                  {getContent(CONTENT.INPUT_REMOVE_CHILD)}
                </Button>
              </div>
            ))}
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {getContent(CONTENT.INPUT_CITY)}
            </label>
            <Select
              value={inputs.selectedCity ?? 'none'}
              onValueChange={(v) => setSelectedCity(v === 'none' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={getContent(CONTENT.INPUT_SELECT_CITY)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{getContent(CONTENT.INPUT_NONE)}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" className="flex-1" size="lg" onClick={handleCalculate}>
              {getContent(CONTENT.INPUT_CALCULATE)}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={reset}>
              {getContent(CONTENT.INPUT_RESET)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
