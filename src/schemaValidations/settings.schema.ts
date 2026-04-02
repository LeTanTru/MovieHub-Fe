import z from 'zod';

export const settingsSchema = z.object({
  audio: z.number(),
  autoNextEpisode: z.boolean(),
  autoSkipIntro: z.boolean(),
  brightness: z.number(),
  playbackSpeed: z.number(),
  resolution: z.number()
});
