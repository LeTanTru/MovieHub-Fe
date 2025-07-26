import { logger } from '@/utils';
import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_API: z.url().optional(),
  NEXT_PUBLIC_API_MEDIA: z.url().optional(),
  NEXT_PUBLIC_API_VIDEO: z.url().optional()
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  NEXT_PUBLIC_API_MEDIA: process.env.NEXT_PUBLIC_API_MEDIA,
  NEXT_PUBLIC_API_VIDEO: process.env.NEXT_PUBLIC_API_VIDEO
});

if (!configProject.success) {
  logger.error('Invalid environment variables:', configProject.error);
  throw new Error('Các khai báo biến môi trường không hợp lệ');
}

const envConfig = configProject.data;

export default envConfig;
