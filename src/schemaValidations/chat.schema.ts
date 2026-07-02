import z from 'zod';

export const chatSchema = z.object({
  accountId: z.string().nonempty('Bắt buộc'),
  content: z.string().optional().nullable(),
  user: z.object({
    id: z.string().nonempty('Bắt buộc'),
    fullName: z.string().nonempty('Bắt buộc'),
    avatarPath: z.string().optional().nullable(),
    username: z.string().optional().nullable()
  }),
  createdDate: z.string().optional().nullable(),
  isRead: z.boolean().optional().nullable()
});

export const chatSearchSchema = z.object({
  roomId: z.string().optional().nullable(),
  userId: z.string().optional().nullable()
});
