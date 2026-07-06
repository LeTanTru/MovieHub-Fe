import z from 'zod';

export const participantSchema = z.object({
  roomId: z.string().nonempty('Bắt buộc'),
  accountIds: z.array(z.string()).nonempty('Bắt buộc')
});

export const participantSearchSchema = z.object({
  role: z.number().optional().nullable(),
  roomId: z.string().optional().nullable(),
  state: z.number().optional().nullable()
});
