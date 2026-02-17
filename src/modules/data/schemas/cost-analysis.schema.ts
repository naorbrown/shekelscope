import { z } from 'zod/v4';
import { SourceSchema } from './common.schema';

const GradeSchema = z.enum(['A', 'B', 'C', 'D', 'F']);

const CategoryAnalysisSchema = z.object({
  id: z.string().min(1),
  overheadPercent: z.number().min(0).max(100),
  reachesServicePercent: z.number().min(0).max(100),
  grade: GradeSchema,
  alternativeCostMultiplier: z.number().min(0).max(1),
  issues: z.string().min(1),
  alternative: z.string().min(1),
  sources: z.array(SourceSchema).min(1),
});

export const CostAnalysisSchema = z.object({
  lastUpdated: z.string(),
  categories: z.array(CategoryAnalysisSchema).min(1),
});

export type CostAnalysisData = z.infer<typeof CostAnalysisSchema>;
