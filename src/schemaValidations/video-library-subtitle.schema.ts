import z from 'zod';

export const videoLibrarySubtitleSearchSchema = z.object({
  label: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  state: z.number().optional().nullable(),
  videoLibraryId: z.string().nonempty('Bắt buộc')
});
