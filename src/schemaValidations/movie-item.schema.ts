import z from 'zod';

export const movieItemSearchSchema = z.object({
  id: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.string().optional(),
  parentId: z.number().optional(),
  title: z.string().optional()
});
