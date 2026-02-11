import { z } from 'zod';

export const commentSchema = z.object({
  id: z.string().optional().nullable(),
  content: z.string(),
  movieId: z.string().optional().nullable(),
  movieItemId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  replyToId: z.string().optional().nullable(),
  replyToKind: z.number().optional().nullable(),
  validTarget: z.boolean().default(false).optional()
});

export const voteCommentSchema = z.object({
  id: z.string().nonempty('Bắt buộc'),
  type: z.number()
});

export const commentSearchSchema = z.object({
  authorId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  isParent: z.string().optional().nullable(),
  isPinned: z.string().optional().nullable(),
  movieId: z.string().optional().nullable(),
  movieItemId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable()
});
