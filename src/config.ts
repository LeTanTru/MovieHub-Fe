import { logger } from '@/logger';
import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_API_MEDIA_URL: z.url(),
  NEXT_PUBLIC_TENANT_ID: z.string().min(1).max(100),
  NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK: z.url(),
  NEXT_PUBLIC_URL: z.url(),
  NEXT_PUBLIC_TINYMCE_URL: z.url()
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_MEDIA_URL: process.env.NEXT_PUBLIC_API_MEDIA_URL,
  NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID,
  NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK:
    process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_TINYMCE_URL: process.env.NEXT_PUBLIC_TINYMCE_URL
});

if (!configProject.success) {
  logger.error('Invalid environment variables:', configProject.error);
  throw new Error('Các khai báo biến môi trường không hợp lệ');
}

const envConfig = configProject.data;

export default envConfig;
