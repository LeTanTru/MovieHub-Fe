import { z } from 'zod';

export const baseSearchSchema = z.object({
  page: z.union([z.number(), z.string()]).optional(),
  size: z.union([z.number(), z.string()]).optional()
});

export const searchSchema = z.object({
  title: z.string().optional()
});
