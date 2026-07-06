import z from 'zod';

export const roomSearchSchema = z.object({
  hostId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  kind: z.number().optional().nullable(),
  movieItemId: z.string().optional().nullable(),
  sortState: z.boolean().default(false).optional().nullable(),
  state: z.number().optional().nullable()
});

export const roomCodeSearchSchema = z.object({
  code: z.string().optional().nullable()
});

export const roomSchema = z
  .object({
    accountIds: z.array(z.string()).optional().nullable(),
    isStartNow: z.boolean('Bắt buộc').default(false),
    kind: z.number('Bắt buộc'),
    movieItemId: z.string().nonempty('Bắt buộc'),
    name: z.string().nonempty('Bắt buộc'),
    startTime: z.string().optional().nullable()
  })
  .superRefine((data, ctx) => {
    if (!data.isStartNow && !data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bắt buộc',
        path: ['startTime']
      });
    }
  });
