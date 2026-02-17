import { z } from 'zod/v4';

export const VatRatesSchema = z.object({
  lastUpdated: z.string(),
  sourceUrl: z.url(),
  currentRate: z.number().min(0).max(1),
  effectiveDate: z.string(),
  previousRate: z.number().min(0).max(1),
  previousRateEndDate: z.string(),
});

export type VatRatesData = z.infer<typeof VatRatesSchema>;
