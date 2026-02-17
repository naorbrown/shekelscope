import type { TaxpayerProfile, TotalTaxResult } from './types';
import type { TaxDataBundle } from '../data/loader';
import { calculateIncomeTax } from './income-tax';
import { calculateNationalInsurance } from './national-insurance';
import { calculateHealthTax } from './health-tax';
import { calculateTaxCredits } from './tax-credits';
import { calculateVat } from './vat';
import { calculateEmployerCosts } from './employer-costs';
import { calculateArnona } from './arnona';
import { roundToAgora, annualToMonthly } from './utils';

/**
 * Calculate the complete tax breakdown for a taxpayer.
 *
 * All rate data is passed explicitly via the `data` parameter —
 * this function has no hidden dependencies on JSON files or global state.
 */
export function calculateTotalTax(
  profile: TaxpayerProfile,
  data: TaxDataBundle
): TotalTaxResult {
  const { taxRates, nationalInsurance: niRates, taxCredits: creditData, vatRates, budget } = data;
  const income = profile.annualGrossIncome;

  // 1. Tax credits
  const taxCredits = calculateTaxCredits(profile, creditData);

  // 2. Income tax
  const incomeTax = calculateIncomeTax(
    income,
    taxRates.incomeTaxBrackets,
    taxRates.surtax,
    taxCredits.totalCreditValue
  );

  // 3. National Insurance
  const nationalInsurance = calculateNationalInsurance(
    income,
    profile.employmentType,
    niRates
  );

  // 4. Health Tax
  const healthTax = calculateHealthTax(
    income,
    profile.employmentType,
    niRates
  );

  // 5. Total mandatory deductions
  const totalDeductions = roundToAgora(
    incomeTax.netTax +
    nationalInsurance.employeeContribution +
    healthTax.contribution
  );

  const netIncome = roundToAgora(income - totalDeductions);

  // 6. VAT estimate (optional)
  const vat = profile.monthlyConsumerSpending
    ? calculateVat(profile.monthlyConsumerSpending * 12, vatRates.currentRate, 0)
    : calculateVat(netIncome, vatRates.currentRate);

  // 7. Employer total cost
  const employerCost = calculateEmployerCosts(
    income,
    niRates,
    profile.pensionContributionRate ?? 0.0625
  );

  // 8. Budget allocation
  const totalTaxPaid = totalDeductions;
  const budgetAllocation = budget.allocations.map((a) => ({
    id: a.id,
    nameEn: a.nameEn,
    nameHe: a.nameHe,
    amount: roundToAgora(totalTaxPaid * (a.percentage / 100)),
    percentage: a.percentage,
    color: a.color,
  }));

  // 9. Arnona (municipal tax)
  const arnona = profile.cityId
    ? calculateArnona(profile.cityId, data.arnonaRates.cities)
    : null;

  return {
    grossIncome: income,
    incomeTax,
    nationalInsurance,
    healthTax,
    taxCredits,
    vat,
    totalDeductions,
    netIncome,
    totalEffectiveRate: income > 0 ? totalDeductions / income : 0,
    monthlyGross: annualToMonthly(income),
    monthlyNet: annualToMonthly(netIncome),
    dailyTax: roundToAgora(totalDeductions / 365),
    employerCost,
    budgetAllocation,
    arnona,
  };
}
