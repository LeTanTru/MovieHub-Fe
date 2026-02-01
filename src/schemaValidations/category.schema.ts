import { z } from 'zod';

export const categorySearchSchema = z.object({
  name: z.string().optional().nullable()
});
