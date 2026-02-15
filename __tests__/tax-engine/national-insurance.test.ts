import { describe, it, expect } from 'vitest';
import { calculateNationalInsurance } from '@/lib/tax-engine/national-insurance';
import niRates from '@/lib/data/national-insurance-2025.json';
import type { NationalInsuranceData } from '@/lib/tax-engine/types';

const rates = niRates as unknown as NationalInsuranceData;

describe('calculateNationalInsurance', () => {
  describe('employee', () => {
    it('returns zero for zero income', () => {
      const result = calculateNationalInsurance(0, 'employee', rates);
      expect(result.employeeContribution).toBe(0);
      expect(result.employerContribution).toBe(0);
    });

    it('applies reduced rate for income below threshold', () => {
      const income = 80000;
      const result = calculateNationalInsurance(income, 'employee', rates);
      expect(result.employeeContribution).toBeCloseTo(income * 0.004, 0);
      expect(result.fullPortionEmployee).toBe(0);
    });

    it('splits income across both brackets', () => {
      const income = 200000;
      const result = calculateNationalInsurance(income, 'employee', rates);
      const expectedReduced = 90264 * 0.004;
      const expectedFull = (200000 - 90264) * 0.07;
      expect(result.employeeContribution).toBeCloseTo(expectedReduced + expectedFull, 0);
    });

    it('caps at maximum insurable income', () => {
      const result1 = calculateNationalInsurance(700000, 'employee', rates);
      const result2 = calculateNationalInsurance(1000000, 'employee', rates);
      expect(result1.employeeContribution).toBeCloseTo(result2.employeeContribution, 2);
    });

    it('calculates employer contribution', () => {
      const income = 200000;
      const result = calculateNationalInsurance(income, 'employee', rates);
      const expectedReduced = 90264 * rates.employer.reduced.nationalInsurance;
      const expectedFull = (200000 - 90264) * rates.employer.full.nationalInsurance;
      expect(result.employerContribution).toBeCloseTo(expectedReduced + expectedFull, 0);
    });

    it('calculates effective rate correctly', () => {
      const income = 300000;
      const result = calculateNationalInsurance(income, 'employee', rates);
      expect(result.effectiveRate).toBeCloseTo(result.employeeContribution / income, 4);
    });
  });

  describe('self-employed', () => {
    it('returns zero for zero income', () => {
      const result = calculateNationalInsurance(0, 'selfEmployed', rates);
      expect(result.employeeContribution).toBe(0);
    });

    it('exempts income below threshold', () => {
      const income = 25000;
      const result = calculateNationalInsurance(income, 'selfEmployed', rates);
      expect(result.employeeContribution).toBe(0);
    });

    it('applies reduced rate for income in reduced bracket', () => {
      const income = 60000;
      const result = calculateNationalInsurance(income, 'selfEmployed', rates);
      const afterExemption = income - 30432;
      expect(result.employeeContribution).toBeCloseTo(afterExemption * 0.0268, 0);
    });

    it('has zero employer contribution', () => {
      const result = calculateNationalInsurance(200000, 'selfEmployed', rates);
      expect(result.employerContribution).toBe(0);
    });
  });
});
