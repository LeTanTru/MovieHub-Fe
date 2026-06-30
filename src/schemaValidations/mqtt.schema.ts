import z from 'zod';

export const mqttMessageSchema = z.object({
  cmd: z.string().min(1, 'cmd is required'),
  data: z.unknown()
});
