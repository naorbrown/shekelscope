import { z } from 'zod/v4';
import { SourceSchema } from './common.schema';

const ArnoraCitySchema = z.object({
  id: z.string().min(1),
  nameEn: z.string().min(1),
  nameHe: z.string().min(1),
  ratePerSqm: z.number().positive(),
  avgApartmentSqm: z.number().positive(),
  avgAnnualArnona: z.number().positive(),
  avgMonthlyArnona: z.number().positive(),
});

export const ArnonaRatesSchema = z.object({
  taxYear: z.number().int().min(2025),
  lastUpdated: z.string(),
  cities: z.array(ArnoraCitySchema).min(1),
  context: z.object({
    whatIsArnona: z.string().min(1),
    whyItMatters: z.string().min(1),
    howItIsCalculated: z.string().min(1),
    discountsAndExemptions: z.string().min(1),
    paymentSchedule: z.string().min(1),
  }),
  sources: z.array(SourceSchema).min(1),
});

export type ArnonaRatesData = z.infer<typeof ArnonaRatesSchema>;
