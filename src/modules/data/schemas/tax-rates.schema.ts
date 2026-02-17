import { z } from 'zod/v4';

const TaxBracketSchema = z.object({
  floor: z.number().nonnegative(),
  ceiling: z.number().positive().nullable(),
  rate: z.number().min(0).max(1),
});

const SurtaxSchema = z.object({
  threshold: z.number().positive(),
  rate: z.number().min(0).max(1),
  description: z.string().optional(),
});

export const TaxRatesSchema = z.object({
  taxYear: z.number().int().min(2025),
  lastUpdated: z.string(),
  sourceUrl: z.url(),
  currency: z.literal('ILS'),
  incomeTaxBrackets: z.array(TaxBracketSchema).min(1),
  surtax: SurtaxSchema,
});

export type TaxRatesData = z.infer<typeof TaxRatesSchema>;
