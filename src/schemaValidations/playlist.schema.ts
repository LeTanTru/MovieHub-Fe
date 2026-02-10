import z from 'zod';

export const playlistSchema = z.object({
  id: z.union([z.string(), z.number()]).optional().nonoptional(),
  name: z.string().nonempty('Bắt buộc')
});

export const playlistItemSchema = z.object({
  actions: z.array(
    z.object({
      action: z.number(),
      playlistId: z.string().nonempty('Bắt buộc')
    })
  ),
  movieId: z.string().nonempty('Bắt buộc')
});

export const removeItemSearchSchema = z.object({
  movieId: z.string().nonempty('Bắt buộc'),
  playlistId: z.string().nonempty('Bắt buộc')
});
