import { describe, it, expect } from 'vitest';
import { calculateTaxCredits } from '@/lib/tax-engine/tax-credits';
import creditData from '@/lib/data/tax-credits-2025.json';
import type { TaxpayerProfile, TaxCreditsData } from '@/lib/tax-engine/types';

const data = creditData as unknown as TaxCreditsData;

function makeProfile(overrides: Partial<TaxpayerProfile> = {}): TaxpayerProfile {
  return {
    annualGrossIncome: 200000,
    employmentType: 'employee',
    gender: 'male',
    taxYear: 2025,
    ...overrides,
  };
}

describe('calculateTaxCredits', () => {
  it('gives 2.25 base points to male resident', () => {
    const result = calculateTaxCredits(makeProfile(), data);
    expect(result.totalPoints).toBe(2.25);
    expect(result.totalCreditValue).toBe(Math.round(2.25 * 2904));
  });

  it('gives 2.75 base points to female resident', () => {
    const result = calculateTaxCredits(makeProfile({ gender: 'female' }), data);
    expect(result.totalPoints).toBe(2.75);
  });

  it('adds child credits for children aged 1-5', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'female', childAges: [3] }),
      data
    );
    expect(result.totalPoints).toBe(5.25);
  });

  it('adds child credits for newborn (age 0)', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'female', childAges: [0] }),
      data
    );
    expect(result.totalPoints).toBe(4.25);
  });

  it('adds correct credits for father with school-age children', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'male', childAges: [8, 12] }),
      data
    );
    expect(result.totalPoints).toBe(4.25);
  });

  it('mother gets more credits for school-age children', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'female', childAges: [8, 12] }),
      data
    );
    expect(result.totalPoints).toBe(6.75);
  });

  it('handles multiple children of different ages', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'female', childAges: [0, 3, 10, 18] }),
      data
    );
    expect(result.totalPoints).toBe(9.75);
  });

  it('gives zero child credits for father with 18-year-old', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'male', childAges: [18] }),
      data
    );
    expect(result.totalPoints).toBe(2.25);
  });

  it('ignores children above age 18', () => {
    const result = calculateTaxCredits(
      makeProfile({ childAges: [25] }),
      data
    );
    expect(result.totalPoints).toBe(2.25);
  });

  it('provides breakdown with categories', () => {
    const result = calculateTaxCredits(
      makeProfile({ gender: 'female', childAges: [3] }),
      data
    );
    expect(result.breakdown).toContainEqual({ category: 'resident', points: 2.25 });
    expect(result.breakdown).toContainEqual({ category: 'woman', points: 0.5 });
    expect(result.breakdown).toContainEqual({ category: 'child_age_3', points: 2.5 });
  });

  it('calculates correct credit value', () => {
    const result = calculateTaxCredits(makeProfile(), data);
    expect(result.pointValue).toBe(2904);
    expect(result.totalCreditValue).toBe(Math.round(result.totalPoints * 2904));
  });
});
