import { describe, it, expect } from 'vitest';
import { calculateIncomeTax } from '@/lib/tax-engine/income-tax';
import taxRates from '@/lib/data/tax-rates-2025.json';
import type { TaxBracket, SurtaxConfig } from '@/lib/tax-engine/types';

const brackets = taxRates.incomeTaxBrackets as TaxBracket[];
const surtax = taxRates.surtax as SurtaxConfig;

describe('calculateIncomeTax', () => {
  it('returns zero for zero income', () => {
    const result = calculateIncomeTax(0, brackets, surtax, 0);
    expect(result.grossTax).toBe(0);
    expect(result.netTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.brackets).toHaveLength(0);
  });

  it('returns zero for negative income', () => {
    const result = calculateIncomeTax(-10000, brackets, surtax, 0);
    expect(result.grossTax).toBe(0);
    expect(result.netTax).toBe(0);
  });

  it('calculates correctly within first bracket only', () => {
    const result = calculateIncomeTax(50000, brackets, surtax, 0);
    expect(result.grossTax).toBe(5000); // 50000 * 0.10
    expect(result.brackets).toHaveLength(1);
    expect(result.brackets[0].taxInBracket).toBe(5000);
    expect(result.brackets[0].rate).toBe(0.10);
  });

  it('calculates correctly at first bracket boundary', () => {
    const result = calculateIncomeTax(84120, brackets, surtax, 0);
    expect(result.grossTax).toBe(8412); // 84120 * 0.10
    expect(result.brackets).toHaveLength(1);
  });

  it('calculates correctly spanning two brackets', () => {
    const result = calculateIncomeTax(100000, brackets, surtax, 0);
    // First bracket: 84120 * 0.10 = 8412
    // Second bracket: (100000 - 84120) * 0.14 = 15880 * 0.14 = 2223.20
    expect(result.grossTax).toBeCloseTo(10635.20, 2);
    expect(result.brackets).toHaveLength(2);
  });

  it('calculates correctly spanning all brackets', () => {
    const result = calculateIncomeTax(800000, brackets, surtax, 0);
    expect(result.brackets).toHaveLength(7);
    const expected = [
      84120 * 0.10,
      (120720 - 84120) * 0.14,
      (193800 - 120720) * 0.20,
      (269280 - 193800) * 0.31,
      (560280 - 269280) * 0.35,
      (721560 - 560280) * 0.47,
      (800000 - 721560) * 0.50,
    ];
    for (let i = 0; i < expected.length; i++) {
      expect(result.brackets[i].taxInBracket).toBeCloseTo(expected[i], 0);
    }
  });

  it('applies tax credits correctly', () => {
    const creditValue = 6534; // 2.25 points * 2904
    const result = calculateIncomeTax(100000, brackets, surtax, creditValue);
    expect(result.netTax).toBeCloseTo(10635.20 - 6534, 2);
    expect(result.creditPointsValue).toBe(creditValue);
  });

  it('floors net tax at zero when credits exceed gross tax', () => {
    const creditValue = 20000;
    const result = calculateIncomeTax(50000, brackets, surtax, creditValue);
    expect(result.grossTax).toBe(5000);
    expect(result.netTax).toBe(0);
  });

  it('applies 3% surtax above threshold', () => {
    const result = calculateIncomeTax(800000, brackets, surtax, 0);
    expect(result.surtax).toBeCloseTo((800000 - 721560) * 0.03, 2);
  });

  it('does not apply surtax below threshold', () => {
    const result = calculateIncomeTax(500000, brackets, surtax, 0);
    expect(result.surtax).toBe(0);
  });

  it('calculates effective rate correctly', () => {
    const result = calculateIncomeTax(200000, brackets, surtax, 0);
    expect(result.effectiveRate).toBeCloseTo(result.netTax / 200000, 4);
  });

  it('handles average salary correctly', () => {
    const annualIncome = 13316 * 12; // 159,792
    const creditValue = Math.round(2.25 * 2904);
    const result = calculateIncomeTax(annualIncome, brackets, surtax, creditValue);
    // 84120*0.10 + (120720-84120)*0.14 + (159792-120720)*0.20
    expect(result.grossTax).toBeCloseTo(8412 + 5124 + 7814.40, 0);
    expect(result.netTax).toBeCloseTo(result.grossTax - creditValue, 0);
  });

  it('handles minimum wage female correctly', () => {
    const annualIncome = 6248 * 12;
    const creditValue = Math.round(2.75 * 2904);
    const result = calculateIncomeTax(annualIncome, brackets, surtax, creditValue);
    expect(result.netTax).toBe(0);
  });
});
