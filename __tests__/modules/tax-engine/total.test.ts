import { describe, it, expect } from 'vitest';
import { calculateTotalTax } from '@/modules/tax-engine/total';
import { loadTaxData } from '@/modules/data/loader';
import type { TaxpayerProfile } from '@/modules/tax-engine/types';

const data = loadTaxData(2025);

function makeProfile(overrides: Partial<TaxpayerProfile> = {}): TaxpayerProfile {
  return {
    annualGrossIncome: 159792,
    employmentType: 'employee',
    gender: 'male',
    taxYear: 2025,
    ...overrides,
  };
}

describe('calculateTotalTax integration', () => {
  it('calculates complete breakdown for average salary employee', () => {
    const result = calculateTotalTax(makeProfile(), data);

    expect(result.grossIncome).toBe(159792);
    expect(result.incomeTax.netTax).toBeGreaterThan(0);
    expect(result.nationalInsurance.employeeContribution).toBeGreaterThan(0);
    expect(result.healthTax.contribution).toBeGreaterThan(0);
    expect(result.totalDeductions).toBeGreaterThan(0);
    expect(result.netIncome).toBeLessThan(result.grossIncome);
    expect(result.totalEffectiveRate).toBeGreaterThan(0);
    expect(result.totalEffectiveRate).toBeLessThan(1);
  });

  it('net income + deductions = gross income', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.netIncome + result.totalDeductions).toBeCloseTo(result.grossIncome, 0);
  });

  it('monthly values are annual / 12', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.monthlyGross).toBeCloseTo(result.grossIncome / 12, 0);
    expect(result.monthlyNet).toBeCloseTo(result.netIncome / 12, 0);
  });

  it('calculates daily tax', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.dailyTax).toBeCloseTo(result.totalDeductions / 365, 0);
  });

  it('includes budget allocation that sums to total deductions', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.budgetAllocation.length).toBeGreaterThan(0);
    const allocSum = result.budgetAllocation.reduce((s, a) => s + a.amount, 0);
    expect(allocSum).toBeCloseTo(result.totalDeductions, 0);
  });

  it('handles minimum wage female employee', () => {
    const result = calculateTotalTax(
      makeProfile({ annualGrossIncome: 6248 * 12, gender: 'female' }),
      data
    );
    expect(result.incomeTax.netTax).toBe(0);
    expect(result.nationalInsurance.employeeContribution).toBeGreaterThan(0);
    expect(result.healthTax.contribution).toBeGreaterThan(0);
  });

  it('handles high earner with surtax', () => {
    const result = calculateTotalTax(
      makeProfile({ annualGrossIncome: 1000000 }),
      data
    );
    expect(result.incomeTax.surtax).toBeGreaterThan(0);
    expect(result.totalEffectiveRate).toBeGreaterThan(0.3);
  });

  it('handles self-employed', () => {
    const result = calculateTotalTax(
      makeProfile({ employmentType: 'selfEmployed' }),
      data
    );
    expect(result.nationalInsurance.employerContribution).toBe(0);
  });

  it('calculates employer cost for employees', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.employerCost).toBeGreaterThan(result.grossIncome);
  });

  it('includes VAT estimate', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.vat).not.toBeNull();
    expect(result.vat!.rate).toBe(0.18);
    expect(result.vat!.annualVatPaid).toBeGreaterThan(0);
  });

  it('effective rate is reasonable for average salary', () => {
    const result = calculateTotalTax(makeProfile(), data);
    expect(result.totalEffectiveRate).toBeGreaterThan(0.15);
    expect(result.totalEffectiveRate).toBeLessThan(0.35);
  });
});
