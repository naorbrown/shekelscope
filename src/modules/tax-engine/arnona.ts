import type { ArnonaResult } from './types';
import type { ArnonaRatesData } from '../data/types';

type ArnonaCity = ArnonaRatesData['cities'][number];

/**
 * Look up municipal tax (arnona) for a given city.
 * Data is passed as a parameter — no hardcoded JSON imports.
 */
export function calculateArnona(
  cityId: string,
  cities: ArnonaCity[]
): ArnonaResult | null {
  const city = cities.find((c) => c.id === cityId);
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
