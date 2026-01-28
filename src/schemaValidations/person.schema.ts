import z from 'zod';

export const personSearchSchema = z.object({
  id: z.number().optional(),
  country: z.string().optional(),
  gender: z.number().optional(),
  kind: z.number().optional(),
  movieId: z.number().optional(),
  name: z.string().optional(),
  otherName: z.string().optional()
});
