import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  movieId: z.string().nonempty('Bắt buộc'),
  rate: z.number()
});

export const reviewVoteSchema = z.object({
  id: z.string(),
  type: z.number()
});

export const reviewSearchSchema = z.object({
  authorId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  movieId: z.string().optional().nullable()
});
