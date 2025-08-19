import z from 'zod';

export const baseSearchSchema = z.object({
  page: z.union([z.number(), z.string()]).optional(),
  size: z.union([z.number(), z.string()]).optional()
});

export const searchSchema = z.object({
  title: z.string().optional()
});

export const movieSearchSchema = z.object({
  ageRating: z.number().optional(),
  originalTitle: z.string().optional(),
  title: z.string().optional(),
  type: z.number().optional()
});
