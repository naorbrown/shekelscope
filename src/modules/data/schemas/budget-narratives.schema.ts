import { z } from 'zod/v4';
import { BilingualTextSchema, SourceSchema } from './common.schema';

const NarrativeActionSchema = z.object({
  type: z.enum(['link', 'contact']),
  labelEn: z.string().min(1),
  labelHe: z.string().min(1),
  url: z.url(),
});

const NarrativeProblemSchema = z.object({
  title: BilingualTextSchema,
  detail: BilingualTextSchema,
  stat: z.string().min(1).optional(),
});

const MinistrySchema = z.object({
  nameEn: z.string().min(1),
  nameHe: z.string().min(1),
  website: z.url(),
  contactUrl: z.url().optional(),
  employees: z.number().int().positive(),
  avgSalaryMonthly: z.number().positive(),
  employeeSourceUrl: z.url(),
});

const CategoryNarrativeSchema = z.object({
  ministry: MinistrySchema,
  whatYouPay: BilingualTextSchema,
  problems: z.array(NarrativeProblemSchema).min(1),
  betterSystem: BilingualTextSchema,
  actions: z.array(NarrativeActionSchema).min(1),
  sources: z.array(SourceSchema).min(1),
});

export const BudgetNarrativesSchema = z.object({
  categories: z.record(z.string(), CategoryNarrativeSchema),
});

export type BudgetNarrativesData = z.infer<typeof BudgetNarrativesSchema>;
