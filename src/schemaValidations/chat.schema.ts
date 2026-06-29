import z from 'zod';

export const chatSchema = z.object({
  accountId: z.string().nonempty('Bắt buộc'),
  content: z.string().optional().nullable(),
  author: z.object({
    id: z.string().nonempty('Bắt buộc'),
    fullName: z.string().nonempty('Bắt buộc'),
    avatarPath: z.string().optional().nullable(),
    username: z.string().optional().nullable()
  }),
  createDate: z.string().nonempty('Bắt buộc')
});
