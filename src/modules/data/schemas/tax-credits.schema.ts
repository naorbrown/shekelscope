import { z } from 'zod/v4';

export const TaxCreditsSchema = z.object({
  taxYear: z.number().int().min(2025),
  lastUpdated: z.string(),
  sourceUrl: z.url(),
  pointValueAnnual: z.number().positive(),
  pointValueMonthly: z.number().positive(),
  baseCredits: z.object({
    resident: z.number().positive(),
    womanAdditional: z.number().nonnegative(),
  }),
  childCredits: z.array(z.object({
    description: z.string().min(1),
    motherPoints: z.number().nonnegative(),
    fatherPoints: z.number().nonnegative(),
  })).min(1),
  childAgeRanges: z.array(z.object({
    minAge: z.number().int().nonnegative(),
    maxAge: z.number().int().nonnegative(),
    index: z.number().int().nonnegative(),
  })).min(1),
});

export type TaxCreditsData = z.infer<typeof TaxCreditsSchema>;
