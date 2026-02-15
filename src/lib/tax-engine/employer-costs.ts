import type { NationalInsuranceData } from './types';
import { roundToAgora } from './utils';

export function calculateEmployerCosts(
  annualGrossIncome: number,
  rates: NationalInsuranceData,
  pensionRate: number = 0.0625
): number {
  if (annualGrossIncome <= 0) return 0;

  const threshold = rates.reducedRateThreshold.annual;
  const ceiling = rates.maxInsurableIncome.annual;
  const insurable = Math.min(annualGrossIncome, ceiling);

  const reducedPortion = Math.min(insurable, threshold);
  const fullPortion = Math.max(0, insurable - threshold);

  const employerNI = roundToAgora(
    reducedPortion * rates.employer.reduced.nationalInsurance +
    fullPortion * rates.employer.full.nationalInsurance
  );

  const pensionContribution = roundToAgora(annualGrossIncome * pensionRate);

  return roundToAgora(annualGrossIncome + employerNI + pensionContribution);
}
