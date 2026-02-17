import { z } from 'zod/v4';

const RateTierSchema = z.object({
  nationalInsurance: z.number().min(0).max(1),
  healthInsurance: z.number().min(0).max(1),
  total: z.number().min(0).max(1),
});

const ThresholdSchema = z.object({
  monthly: z.number().positive(),
  annual: z.number().positive(),
  description: z.string().optional(),
});

export const NationalInsuranceSchema = z.object({
  taxYear: z.number().int().min(2025),
  lastUpdated: z.string(),
  sourceUrl: z.url(),
  currency: z.literal('ILS'),
  averageWageMonthly: z.number().positive(),
  reducedRateThreshold: ThresholdSchema,
  maxInsurableIncome: z.object({
    monthly: z.number().positive(),
    annual: z.number().positive(),
  }),
  employee: z.object({ reduced: RateTierSchema, full: RateTierSchema }),
  employer: z.object({ reduced: RateTierSchema, full: RateTierSchema }),
  selfEmployed: z.object({
    reduced: RateTierSchema,
    full: RateTierSchema,
    exemptionThreshold: ThresholdSchema,
  }),
});

export type NationalInsuranceData = z.infer<typeof NationalInsuranceSchema>;
