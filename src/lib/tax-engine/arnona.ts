import type { ArnonaResult } from './types';
import arnonaData from '@/lib/data/arnona-rates.json';

export function calculateArnona(cityId: string): ArnonaResult | null {
  const city = arnonaData.cities.find((c) => c.id === cityId);
  if (!city) return null;

  return {
    annualAmount: city.avgAnnualArnona,
    monthlyAmount: city.avgMonthlyArnona,
    cityId: city.id,
    cityNameEn: city.nameEn,
    cityNameHe: city.nameHe,
    ratePerSqm: city.ratePerSqm,
  };
}
