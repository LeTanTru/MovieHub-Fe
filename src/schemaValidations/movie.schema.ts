import { z } from 'zod';

export const movieSearchSchema = z.object({
  ageRating: z.number().optional().nullable(),
  categoryIds: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  excludeIds: z.array(z.string()).optional().nullable(),
  id: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().nullable(),
  keyword: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  originalTitle: z.number().optional().nullable(),
  releaseYear: z.number().optional().nullable(),
  title: z.string().optional().nullable(),
  type: z.number().optional().nullable()
});
