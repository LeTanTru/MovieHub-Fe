import z from 'zod';

export const moviePersonSearchSchema = z.object({
  id: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.string().optional(),
  personId: z.string().optional()
});
