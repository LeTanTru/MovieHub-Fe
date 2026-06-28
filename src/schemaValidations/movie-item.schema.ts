import { z } from 'zod';

export const movieItemSearchSchema = z.object({
  id: z.string().optional().nullable(),
  kind: z.number().optional().nullable(),
  movieId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  title: z.string().optional().nullable()
});
