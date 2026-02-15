import { describe, it, expect } from 'vitest';
import {
  calculateReformedTax,
  calculateCostOfLivingSavings,
  calculateInvestmentFreedom,
  calculateFreedomScore,
} from '@/lib/freedom-calculator';
import { calculateTotalTax } from '@/lib/tax-engine/total';
import { analyzeEfficiency } from '@/lib/efficiency-analyzer';
import type { TaxpayerProfile, TotalTaxResult } from '@/lib/tax-engine/types';
import type { ReformScenario } from '@/lib/data/types';

function makeProfile(
  overrides: Partial<TaxpayerProfile> = {}
): TaxpayerProfile {
  return {
    annualGrossIncome: 159792, // average salary: 13,316/mo
    employmentType: 'employee',
    gender: 'male',
    taxYear: 2025,
    ...overrides,
  };
}

function getResult(overrides: Partial<TaxpayerProfile> = {}): TotalTaxResult {
  return calculateTotalTax(makeProfile(overrides));
}

const moderateScenario: ReformScenario = {
  id: 'moderate',
  label: 'Moderate Reform',
  incomeTaxReductionPercent: 15,
  vatReductionPercent: 25,
  niReductionPercent: 10,
  description: 'Test scenario',
};

const ambitiousScenario: ReformScenario = {
  id: 'ambitious',
  label: 'Ambitious Reform',
  incomeTaxReductionPercent: 30,
  vatReductionPercent: 50,
  niReductionPercent: 20,
  description: 'Test scenario',
};

describe('calculateReformedTax', () => {
  it('returns positive savings for moderate scenario on average salary', () => {
    const result = getResult();
    const reformed = calculateReformedTax(result, moderateScenario);

    expect(reformed.annualSavings).toBeGreaterThan(0);
    expect(reformed.monthlySavings).toBeGreaterThan(0);
    expect(reformed.reformedTotalDeductions).toBeLessThan(
      reformed.currentTotalDeductions
    );
  });

  it('ambitious scenario saves more than moderate', () => {
    const result = getResult();
    const moderate = calculateReformedTax(result, moderateScenario);
    const ambitious = calculateReformedTax(result, ambitiousScenario);

    expect(ambitious.annualSavings).toBeGreaterThan(moderate.annualSavings);
  });

  it('reformedEffectiveRate is lower than currentEffectiveRate', () => {
    const result = getResult();
    const reformed = calculateReformedTax(result, moderateScenario);

    expect(reformed.reformedEffectiveRate).toBeLessThan(
      reformed.currentEffectiveRate
    );
  });

  it('extraMonthsOfSalary equals annualSavings / monthlyGross', () => {
    const result = getResult();
    const reformed = calculateReformedTax(result, moderateScenario);

    const expected =
      Math.round((reformed.annualSavings / result.monthlyGross) * 10) / 10;
    expect(reformed.extraMonthsOfSalary).toBeCloseTo(expected, 1);
  });

  it('handles zero income gracefully', () => {
    const result = getResult({ annualGrossIncome: 0 });
    const reformed = calculateReformedTax(result, moderateScenario);

    expect(reformed.annualSavings).toBe(0);
    expect(reformed.currentEffectiveRate).toBe(0);
    expect(reformed.reformedEffectiveRate).toBe(0);
    expect(reformed.extraMonthsOfSalary).toBe(0);
  });

  it('zero-reduction scenario produces zero savings', () => {
    const result = getResult();
    const noReform: ReformScenario = {
      id: 'none',
      label: 'No Reform',
      incomeTaxReductionPercent: 0,
      vatReductionPercent: 0,
      niReductionPercent: 0,
      description: 'No changes',
    };
    const reformed = calculateReformedTax(result, noReform);
    expect(reformed.annualSavings).toBe(0);
  });
});

describe('calculateCostOfLivingSavings', () => {
  const avgMonthlyNet = 10000;

  it('food savings match deregulation multiplier', () => {
    const savings = calculateCostOfLivingSavings(avgMonthlyNet);
    // Food = 30% of net = 3000; 15% reduction = 450 savings
    expect(savings.currentMonthlyFood).toBe(3000);
    expect(savings.foodSavingsMonthly).toBe(450);
    expect(savings.reformedMonthlyFood).toBe(2550);
  });

  it('car savings reflect removal of purchase tax', () => {
    const savings = calculateCostOfLivingSavings(avgMonthlyNet);
    // Base price = 150000 / 2.07 ≈ 72464
    // Current = 72464 * 2.07 = 150000
    // Reformed = 72464 * 1.18 ≈ 85507
    expect(savings.currentCarCost).toBe(150000);
    expect(savings.reformedCarCost).toBeGreaterThan(80000);
    expect(savings.reformedCarCost).toBeLessThan(90000);
    expect(savings.carSavings).toBeGreaterThan(60000);
  });

  it('rent savings reflect housing deregulation percentage', () => {
    const savings = calculateCostOfLivingSavings(avgMonthlyNet);
    // Average rent of 3 cities, 30% reduction
    expect(savings.currentMonthlyRent).toBeGreaterThan(0);
    expect(savings.rentSavingsMonthly).toBeCloseTo(
      savings.currentMonthlyRent * 0.3,
      -1
    );
  });

  it('totalMonthlySavings = food + rent savings', () => {
    const savings = calculateCostOfLivingSavings(avgMonthlyNet);
    expect(savings.totalMonthlySavings).toBe(
      savings.foodSavingsMonthly + savings.rentSavingsMonthly
    );
  });

  it('totalAnnualSavings = totalMonthlySavings * 12', () => {
    const savings = calculateCostOfLivingSavings(avgMonthlyNet);
    expect(savings.totalAnnualSavings).toBe(savings.totalMonthlySavings * 12);
  });

  it('handles zero net income', () => {
    const savings = calculateCostOfLivingSavings(0);
    expect(savings.currentMonthlyFood).toBe(0);
    expect(savings.foodSavingsMonthly).toBe(0);
  });
});

describe('calculateInvestmentFreedom', () => {
  const annualInvestable = 50000;

  it('10yr compound is higher with lower capital gains', () => {
    const result = calculateInvestmentFreedom(annualInvestable);
    expect(result.compoundEffect10yr.reformedValue).toBeGreaterThan(
      result.compoundEffect10yr.currentValue
    );
  });

  it('difference is always non-negative', () => {
    const result = calculateInvestmentFreedom(annualInvestable);
    expect(result.compoundEffect10yr.difference).toBeGreaterThanOrEqual(0);
    expect(result.investmentOn100k.difference).toBeGreaterThanOrEqual(0);
  });

  it('current rate is 25%', () => {
    const result = calculateInvestmentFreedom(annualInvestable);
    expect(result.currentCapitalGainsRate).toBe(25);
  });

  it('on 100k gain, current tax is 25000', () => {
    const result = calculateInvestmentFreedom(annualInvestable);
    expect(result.investmentOn100k.currentTax).toBe(25000);
  });

  it('handles zero investable amount', () => {
    const result = calculateInvestmentFreedom(0);
    expect(result.compoundEffect10yr.currentValue).toBe(0);
    expect(result.compoundEffect10yr.reformedValue).toBe(0);
    expect(result.compoundEffect10yr.difference).toBe(0);
  });
});

describe('calculateFreedomScore', () => {
  it('overall score is between 0 and 100', () => {
    const result = getResult();
    const efficiency = analyzeEfficiency(result.budgetAllocation);
    const score = calculateFreedomScore(result, efficiency);

    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
  });

  it('sub-scores are each between 0 and 100', () => {
    const result = getResult();
    const efficiency = analyzeEfficiency(result.budgetAllocation);
    const score = calculateFreedomScore(result, efficiency);

    expect(score.taxFreedom).toBeGreaterThanOrEqual(0);
    expect(score.taxFreedom).toBeLessThanOrEqual(100);
    expect(score.purchasingPower).toBeGreaterThanOrEqual(0);
    expect(score.purchasingPower).toBeLessThanOrEqual(100);
    expect(score.investmentFreedom).toBeGreaterThanOrEqual(0);
    expect(score.investmentFreedom).toBeLessThanOrEqual(100);
  });

  it('grade mapping is correct', () => {
    const result = getResult();
    const efficiency = analyzeEfficiency(result.budgetAllocation);
    const score = calculateFreedomScore(result, efficiency);

    if (score.overall >= 80) expect(score.grade).toBe('A');
    else if (score.overall >= 65) expect(score.grade).toBe('B');
    else if (score.overall >= 50) expect(score.grade).toBe('C');
    else if (score.overall >= 35) expect(score.grade).toBe('D');
    else expect(score.grade).toBe('F');
  });

  it('returns valid grade string', () => {
    const result = getResult();
    const efficiency = analyzeEfficiency(result.budgetAllocation);
    const score = calculateFreedomScore(result, efficiency);

    expect(['A', 'B', 'C', 'D', 'F']).toContain(score.grade);
  });

  it('handles high-income profile', () => {
    const result = getResult({ annualGrossIncome: 1_000_000 });
    const efficiency = analyzeEfficiency(result.budgetAllocation);
    const score = calculateFreedomScore(result, efficiency);

    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
  });
});
