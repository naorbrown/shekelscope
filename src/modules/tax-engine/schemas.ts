import { z } from 'zod/v4';

/**
 * Zod schema for validating TaxpayerProfile input.
 * Used at the boundary (form → engine) to catch bad input early.
 */
export const TaxpayerProfileSchema = z.object({
  annualGrossIncome: z.number().nonnegative(),
  employmentType: z.enum(['employee', 'selfEmployed']),
  gender: z.enum(['male', 'female']),
  taxYear: z.literal(2025),
  childAges: z.array(z.number().int().nonnegative().max(120)).optional(),
  pensionContributionRate: z.number().min(0).max(1).optional(),
  monthlyConsumerSpending: z.number().nonnegative().optional(),
  cityId: z.string().min(1).optional(),
});
