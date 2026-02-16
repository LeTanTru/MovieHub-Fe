import z from 'zod';

export const watchHistorySchema = z.object({
  lastWatchSeconds: z.number(),
  movieItemId: z.string()
});

export const watchHistorySearchSchema = z.object({
  movieId: z.string()
});
