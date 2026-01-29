import z from 'zod';

export const collectionSearchSchema = z.object({
  name: z.string().optional().nullable(),
  randomData: z.boolean().optional().nullable(),
  style: z.string().optional().nullable(),
  type: z.number().optional().nullable()
});
