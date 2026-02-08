import z from 'zod';

export const favouriteSchema = z.object({
  targetId: z.string(),
  type: z.number()
});

export const favouriteSearchSchema = z.object({
  id: z.string().optional().nullable(),
  movieId: z.string().optional().nullable(),
  personId: z.string().optional().nullable(),
  type: z.number().optional().nullable(),
  userId: z.string().optional().nullable()
});
