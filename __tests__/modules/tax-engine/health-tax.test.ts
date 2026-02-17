import { describe, it, expect } from 'vitest';
import { calculateHealthTax } from '@/modules/tax-engine/health-tax';
import { loadTaxData } from '@/modules/data/loader';

const data = loadTaxData(2025);
const rates = data.nationalInsurance;

describe('calculateHealthTax', () => {
  it('returns zero for zero income', () => {
    const result = calculateHealthTax(0, 'employee', rates);
    expect(result.contribution).toBe(0);
  });

  it('applies reduced rate below threshold for employee', () => {
    const income = 80000;
    const result = calculateHealthTax(income, 'employee', rates);
    expect(result.contribution).toBeCloseTo(income * 0.031, 0);
    expect(result.fullPortion).toBe(0);
  });

  it('splits across brackets for employee', () => {
    const income = 200000;
    const result = calculateHealthTax(income, 'employee', rates);
    const expectedReduced = 90264 * 0.031;
    const expectedFull = (200000 - 90264) * 0.05;
    expect(result.contribution).toBeCloseTo(expectedReduced + expectedFull, 0);
  });

  it('caps at maximum insurable income', () => {
    const result1 = calculateHealthTax(700000, 'employee', rates);
    const result2 = calculateHealthTax(1000000, 'employee', rates);
    expect(result1.contribution).toBeCloseTo(result2.contribution, 2);
  });

  it('calculates effective rate', () => {
    const income = 250000;
    const result = calculateHealthTax(income, 'employee', rates);
    expect(result.effectiveRate).toBeCloseTo(result.contribution / income, 4);
  });
});
