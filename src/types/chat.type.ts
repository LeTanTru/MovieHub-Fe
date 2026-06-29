import { chatSchema } from '@/schemaValidations/chat.schema';
import z from 'zod';

export type ChatBodyType = z.infer<typeof chatSchema>;
