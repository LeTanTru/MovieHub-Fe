import { logger } from './logger';
import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_API_META_ENDPOINT_URL: z.url(),
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_API_MEDIA_URL: z.url(),
  NEXT_PUBLIC_TENANT_ID: z.string().min(1).max(100),
  NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK: z.url(),
  NEXT_PUBLIC_URL: z.url(),
  NEXT_PUBLIC_TINYMCE_URL: z.url(),
  NEXT_PUBLIC_APP_USERNAME: z.string(),
  NEXT_PUBLIC_APP_PASSWORD: z.string(),
  NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN: z.string(),
  NEXT_PUBLIC_MEDIA_HOST: z.string()
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_META_ENDPOINT_URL:
    process.env.NEXT_PUBLIC_API_META_ENDPOINT_URL,
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_MEDIA_URL: process.env.NEXT_PUBLIC_API_MEDIA_URL,
  NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID,
  NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK:
    process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_TINYMCE_URL: process.env.NEXT_PUBLIC_TINYMCE_URL,
  NEXT_PUBLIC_APP_USERNAME: process.env.NEXT_PUBLIC_APP_USERNAME,
  NEXT_PUBLIC_APP_PASSWORD: process.env.NEXT_PUBLIC_APP_PASSWORD,
  NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN:
    process.env.NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN,
  NEXT_PUBLIC_MEDIA_HOST: process.env.NEXT_PUBLIC_MEDIA_HOST
});

if (!configProject.success) {
  logger.error('Invalid environment variables:', configProject.error);
  throw new Error('Các khai báo biến môi trường không hợp lệ');
}

const envConfig = configProject.data;

export default envConfig;
