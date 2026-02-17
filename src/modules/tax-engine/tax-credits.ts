import type { TaxpayerProfile, TaxCreditResult } from './types';
import type { TaxCreditsData } from '../data/types';

export function calculateTaxCredits(
  profile: TaxpayerProfile,
  creditData: TaxCreditsData
): TaxCreditResult {
  const breakdown: { category: string; points: number }[] = [];

  // Base resident credit points
  breakdown.push({ category: 'resident', points: creditData.baseCredits.resident });

  // Additional credit for women
  if (profile.gender === 'female') {
    breakdown.push({ category: 'woman', points: creditData.baseCredits.womanAdditional });
  }

  // Child credits
  if (profile.childAges) {
    for (const age of profile.childAges) {
      const rangeEntry = creditData.childAgeRanges.find(
        (r) => age >= r.minAge && age <= r.maxAge
      );
      if (rangeEntry) {
        const creditEntry = creditData.childCredits[rangeEntry.index];
        const points =
          profile.gender === 'female'
            ? creditEntry.motherPoints
            : creditEntry.fatherPoints;
        if (points > 0) {
          breakdown.push({
            category: `child_age_${age}`,
            points,
          });
        }
      }
    }
  }

  const totalPoints = breakdown.reduce((sum, b) => sum + b.points, 0);
  const totalCreditValue = Math.round(totalPoints * creditData.pointValueAnnual);

  return {
    totalPoints,
    pointValue: creditData.pointValueAnnual,
    totalCreditValue,
    breakdown,
  };
}
