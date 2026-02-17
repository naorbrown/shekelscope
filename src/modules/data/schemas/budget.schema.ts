import { z } from 'zod/v4';

const BudgetAllocationSchema = z.object({
  id: z.string().min(1),
  nameEn: z.string().min(1),
  nameHe: z.string().min(1),
  percentage: z.number().positive().max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const BudgetSchema = z.object({
  taxYear: z.number().int().min(2025),
  lastUpdated: z.string(),
  sourceUrl: z.url(),
  totalBudgetBillionNIS: z.number().positive(),
  totalTaxRevenueBillionNIS: z.number().positive(),
  allocations: z.array(BudgetAllocationSchema).min(1),
}).refine(
  (data) => {
    const total = data.allocations.reduce((s, a) => s + a.percentage, 0);
    return Math.abs(total - 100) < 0.5;
  },
  'Budget allocations must sum to ~100%'
);

export type BudgetData = z.infer<typeof BudgetSchema>;
