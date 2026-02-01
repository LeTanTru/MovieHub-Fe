import { z } from 'zod';

export const collectionSearchSchema = z.object({
  collectionId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  randomData: z.boolean().optional().nullable(),
  style: z.string().optional().nullable(),
  type: z.number().optional().nullable()
});
