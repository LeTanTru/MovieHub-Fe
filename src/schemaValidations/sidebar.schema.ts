import z from 'zod';

export const sidebarSearchSchema = z.object({
  active: z.boolean().optional().nullable()
});
