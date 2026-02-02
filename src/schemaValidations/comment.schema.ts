import { z } from 'zod';

export const commentSearchSchema = z.object({
  authorId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  isParent: z.string().optional().nullable(),
  isPinned: z.string().optional().nullable(),
  movieId: z.string().optional().nullable(),
  movieItemId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable()
});
