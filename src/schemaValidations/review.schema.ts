import { z } from 'zod';

export const reviewSearchSchema = z.object({
  authorId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  movieId: z.string().optional().nullable()
});
