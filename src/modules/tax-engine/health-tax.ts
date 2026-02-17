import type { EmploymentType, HealthTaxResult } from './types';
import type { NationalInsuranceData } from '../data/types';
import { roundToAgora } from './utils';

export function calculateHealthTax(
  annualGrossIncome: number,
  employmentType: EmploymentType,
  rates: NationalInsuranceData
): HealthTaxResult {
  if (annualGrossIncome <= 0) {
    return { contribution: 0, reducedPortion: 0, fullPortion: 0, effectiveRate: 0 };
  }

  const threshold = rates.reducedRateThreshold.annual;
  const ceiling = rates.maxInsurableIncome.annual;
  const insurable = Math.min(annualGrossIncome, ceiling);

  let reducedRate: number;
  let fullRate: number;

  if (employmentType === 'employee') {
    reducedRate = rates.employee.reduced.healthInsurance;
    fullRate = rates.employee.full.healthInsurance;
  } else {
    reducedRate = rates.selfEmployed.reduced.healthInsurance;
    fullRate = rates.selfEmployed.full.healthInsurance;
  }

  const reducedPortion = Math.min(insurable, threshold);
  const fullPortion = Math.max(0, insurable - threshold);

  const reducedAmount = roundToAgora(reducedPortion * reducedRate);
  const fullAmount = roundToAgora(fullPortion * fullRate);
  const contribution = roundToAgora(reducedAmount + fullAmount);

  return {
    contribution,
    reducedPortion: reducedAmount,
    fullPortion: fullAmount,
    effectiveRate: annualGrossIncome > 0 ? contribution / annualGrossIncome : 0,
  };
}
