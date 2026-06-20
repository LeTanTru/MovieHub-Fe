import z from 'zod';

export const userReportSchema = z.object({
  content: z.string().optional().nullable(),
  objectId: z.string().nonempty('Bắt buộc'),
  type: z.number('Bắt buộc')
});
