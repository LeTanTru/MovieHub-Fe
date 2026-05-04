import z from 'zod';

export const notificationUpdateReadSchema = z.object({
  ids: z.array(z.string())
});
