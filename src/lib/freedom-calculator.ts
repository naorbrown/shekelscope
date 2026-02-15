import type { TotalTaxResult } from '@/lib/tax-engine/types';
import type { EfficiencyResult } from '@/lib/efficiency-analyzer';
import type { ReformScenario } from '@/lib/data/types';
import costOfLivingData from '@/lib/data/cost-of-living.json';
import freedomData from '@/lib/data/freedom-analysis.json';

// --- Result Types ---

export interface ReformedTaxResult {
  currentTotalDeductions: number;
  reformedTotalDeductions: number;
  annualSavings: number;
  monthlySavings: number;
  currentEffectiveRate: number;
  reformedEffectiveRate: number;
  extraMonthsOfSalary: number;
}

export interface CostOfLivingSavings {
  currentMonthlyFood: number;
  reformedMonthlyFood: number;
  foodSavingsMonthly: number;
  currentCarCost: number;
  reformedCarCost: number;
  carSavings: number;
  currentMonthlyRent: number;
  reformedMonthlyRent: number;
  rentSavingsMonthly: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export interface InvestmentFreedomResult {
  currentCapitalGainsRate: number;
  reformedCapitalGainsRate: number;
  investmentOn100k: {
    currentTax: number;
    reformedTax: number;
    difference: number;
  };
  compoundEffect10yr: {
    currentValue: number;
    reformedValue: number;
    difference: number;
  };
}

export interface FreedomScore {
  overall: number;
  taxFreedom: number;
  purchasingPower: number;
  investmentFreedom: number;
  grade: string;
}

// --- Constants ---

const AVERAGE_CAR_PRICE_ILS = 150_000;
const ASSUMED_ANNUAL_RETURN = 0.08;
const COMPOUND_YEARS = 10;
const COMPETITIVE_CAP_GAINS_RATE = 0.15;
const MAX_EFFECTIVE_RATE = 0.55; // France-level benchmark for scoring

// --- Pure Functions ---

/**
 * Calculate what taxes would be under a given reform scenario.
 * Applies percentage reductions to income tax, NI, and VAT.
 */
export function calculateReformedTax(
  result: TotalTaxResult,
  scenario: ReformScenario
): ReformedTaxResult {
  const currentIncomeTax = result.incomeTax.netTax;
  const currentNI = result.nationalInsurance.employeeContribution;
  const currentHealth = result.healthTax.contribution;
  const currentVat = result.vat?.annualVatPaid ?? 0;

  const reformedIncomeTax =
    currentIncomeTax * (1 - scenario.incomeTaxReductionPercent / 100);
  const reformedNI =
    currentNI * (1 - scenario.niReductionPercent / 100);
  const reformedHealth =
    currentHealth * (1 - scenario.niReductionPercent / 100);
  const reformedVat =
    currentVat * (1 - scenario.vatReductionPercent / 100);

  const currentTotalDeductions = result.totalDeductions + currentVat;
  const reformedTotalDeductions =
    reformedIncomeTax + reformedNI + reformedHealth + reformedVat;

  const annualSavings = currentTotalDeductions - reformedTotalDeductions;
  const monthlySavings = annualSavings / 12;
  const currentEffectiveRate =
    result.grossIncome > 0 ? currentTotalDeductions / result.grossIncome : 0;
  const reformedEffectiveRate =
    result.grossIncome > 0
      ? reformedTotalDeductions / result.grossIncome
      : 0;
  const extraMonthsOfSalary =
    result.monthlyGross > 0 ? annualSavings / result.monthlyGross : 0;

  return {
    currentTotalDeductions: Math.round(currentTotalDeductions),
    reformedTotalDeductions: Math.round(reformedTotalDeductions),
    annualSavings: Math.round(annualSavings),
    monthlySavings: Math.round(monthlySavings),
    currentEffectiveRate,
    reformedEffectiveRate,
    extraMonthsOfSalary: Math.round(extraMonthsOfSalary * 10) / 10,
  };
}

/**
 * Calculate monthly cost-of-living savings from deregulation.
 * Uses basket data and deregulation multipliers.
 */
export function calculateCostOfLivingSavings(
  monthlyNet: number
): CostOfLivingSavings {
  // Estimate monthly food spend at ~30% of net for Israeli households
  const foodSpendRatio = 0.3;
  const currentMonthlyFood = monthlyNet * foodSpendRatio;

  const foodReduction =
    (freedomData.deregulationMultipliers.food.estimatedReductionPercent ?? 0) /
    100;
  const reformedMonthlyFood = currentMonthlyFood * (1 - foodReduction);
  const foodSavingsMonthly = currentMonthlyFood - reformedMonthlyFood;

  // Car costs: average car price under current vs reformed tax
  const currentTaxRate =
    (freedomData.deregulationMultipliers.cars.currentTaxPercent ?? 107) / 100;
  const reformedTaxRate =
    (freedomData.deregulationMultipliers.cars.reformedTaxPercent ?? 18) / 100;

  const baseCarPrice = AVERAGE_CAR_PRICE_ILS / (1 + currentTaxRate);
  const currentCarCost = baseCarPrice * (1 + currentTaxRate);
  const reformedCarCost = baseCarPrice * (1 + reformedTaxRate);
  const carSavings = currentCarCost - reformedCarCost;

  // Rent: average of 3 cities
  const rents = costOfLivingData.averageMonthlyRent;
  const currentMonthlyRent =
    (rents.telAviv + rents.jerusalem + rents.haifa) / 3;
  const rentReduction =
    (freedomData.deregulationMultipliers.housing
      .estimatedRentReductionPercent ?? 30) / 100;
  const reformedMonthlyRent = currentMonthlyRent * (1 - rentReduction);
  const rentSavingsMonthly = currentMonthlyRent - reformedMonthlyRent;

  const totalMonthlySavings = foodSavingsMonthly + rentSavingsMonthly;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    currentMonthlyFood: Math.round(currentMonthlyFood),
    reformedMonthlyFood: Math.round(reformedMonthlyFood),
    foodSavingsMonthly: Math.round(foodSavingsMonthly),
    currentCarCost: Math.round(currentCarCost),
    reformedCarCost: Math.round(reformedCarCost),
    carSavings: Math.round(carSavings),
    currentMonthlyRent: Math.round(currentMonthlyRent),
    reformedMonthlyRent: Math.round(reformedMonthlyRent),
    rentSavingsMonthly: Math.round(rentSavingsMonthly),
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
  };
}

/**
 * Calculate investment freedom metrics.
 * Shows how lower capital gains taxes lead to better compounding
 * over 10 years at an assumed 8% annual return.
 */
export function calculateInvestmentFreedom(
  annualInvestableAmount: number
): InvestmentFreedomResult {
  const currentRate = freedomData.capitalGainsTax.israel.standard / 100;
  const reformedRate = COMPETITIVE_CAP_GAINS_RATE;

  // On a hypothetical 100k gain
  const gain100k = 100_000;
  const currentTax = gain100k * currentRate;
  const reformedTax = gain100k * reformedRate;

  // 10-year compound with annual capital gains drag
  // Each year: value grows by return, then gains are taxed
  const afterTaxReturn = (rate: number) => ASSUMED_ANNUAL_RETURN * (1 - rate);

  let currentValue = 0;
  let reformedValue = 0;
  for (let year = 0; year < COMPOUND_YEARS; year++) {
    currentValue =
      (currentValue + annualInvestableAmount) *
      (1 + afterTaxReturn(currentRate));
    reformedValue =
      (reformedValue + annualInvestableAmount) *
      (1 + afterTaxReturn(reformedRate));
  }

  return {
    currentCapitalGainsRate: currentRate * 100,
    reformedCapitalGainsRate: reformedRate * 100,
    investmentOn100k: {
      currentTax: Math.round(currentTax),
      reformedTax: Math.round(reformedTax),
      difference: Math.round(currentTax - reformedTax),
    },
    compoundEffect10yr: {
      currentValue: Math.round(currentValue),
      reformedValue: Math.round(reformedValue),
      difference: Math.round(reformedValue - currentValue),
    },
  };
}

/**
 * Compute composite 0-100 freedom score from three dimensions.
 */
export function calculateFreedomScore(
  result: TotalTaxResult,
  efficiencyResults: EfficiencyResult[]
): FreedomScore {
  // Tax Freedom: based on effective rate vs benchmark, penalized by overhead
  const effectiveRate = result.totalEffectiveRate;
  const totalContribution = efficiencyResults.reduce(
    (sum, e) => sum + e.yourContribution,
    0
  );
  const totalOverhead = efficiencyResults.reduce(
    (sum, e) => sum + e.estimatedOverhead,
    0
  );
  const overheadPenalty =
    totalContribution > 0 ? (totalOverhead / totalContribution) * 10 : 0;
  const taxFreedom = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (1 - effectiveRate / MAX_EFFECTIVE_RATE) * 100 - overheadPenalty
      )
    )
  );

  // Purchasing Power: based on cost-of-living premium vs OECD average
  const foodPremium =
    costOfLivingData.foodPriceIndexVsEU.israel /
    costOfLivingData.foodPriceIndexVsEU.euAverage;
  const purchasingPower = Math.max(
    0,
    Math.min(100, Math.round((1 / foodPremium) * 100))
  );

  // Investment Freedom: based on capital gains rate vs benchmarks
  const capGainsRate = freedomData.capitalGainsTax.israel.standard / 100;
  const investmentFreedom = Math.max(
    0,
    Math.min(100, Math.round((1 - capGainsRate / 0.37) * 100))
  );

  // Weighted overall: 40% tax, 35% purchasing, 25% investment
  const overall = Math.round(
    taxFreedom * 0.4 + purchasingPower * 0.35 + investmentFreedom * 0.25
  );

  const grade =
    overall >= 80
      ? 'A'
      : overall >= 65
        ? 'B'
        : overall >= 50
          ? 'C'
          : overall >= 35
            ? 'D'
            : 'F';

  return {
    overall,
    taxFreedom,
    purchasingPower,
    investmentFreedom,
    grade,
  };
}
