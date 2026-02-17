import { z } from 'zod/v4';

const ActionItemSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  url: z.url().optional(),
});

const ActionLevelSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  actions: z.array(ActionItemSchema).min(1),
});

export const ActionResourcesSchema = z.object({
  levels: z.array(ActionLevelSchema).min(1),
});

export type ActionResourcesData = z.infer<typeof ActionResourcesSchema>;
