import { z } from 'zod/v4';

const CivicPlatformSchema = z.object({
  id: z.string().min(1),
  nameEn: z.string().min(1),
  nameHe: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionHe: z.string().min(1),
  url: z.url(),
  contactUrl: z.url().optional(),
  icon: z.string().min(1),
});

export const CivicPlatformsSchema = z.object({
  platforms: z.array(CivicPlatformSchema).min(1),
});

export type CivicPlatformsData = z.infer<typeof CivicPlatformsSchema>;
