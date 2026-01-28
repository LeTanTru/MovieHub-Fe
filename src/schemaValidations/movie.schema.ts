import z from 'zod';

export const movieSearchSchema = z.object({
  ageRating: z.number().optional().nullable(),
  categoryIds: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().nullable(),
  language: z.string().optional().nullable(),
  originalTitle: z.number().optional().nullable(),
  title: z.string().optional().nullable(),
  type: z.number().optional().nullable()
});
