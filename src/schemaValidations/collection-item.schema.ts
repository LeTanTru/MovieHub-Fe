import z from 'zod';

export const collectionItemSearchSchema = z.object({
  collectionId: z.string()
});
