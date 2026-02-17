import { z } from 'zod/v4';

export const SourceSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
});

export const BilingualTextSchema = z.object({
  en: z.string().min(1),
  he: z.string().min(1),
});
