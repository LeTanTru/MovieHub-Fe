import z from 'zod';

export const searchSchema = z.object({
  title: z.string().optional()
});
