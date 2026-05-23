import { logger } from './logger';
import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_AUTH_API_URL: z.url(),
  NEXT_PUBLIC_API_ENDPOINT_URL: z.url(),
  NEXT_PUBLIC_API_MEDIA_URL: z.url(),
  NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL: z.url(),
  NEXT_PUBLIC_URL: z.url(),
  NEXT_PUBLIC_MEDIA_HOST: z.string(),
  NEXT_PUBLIC_CLIENT_TYPE: z.string(),
  NEXT_PUBLIC_MQTT_BROKER: z.string(),
  NEXT_PUBLIC_MQTT_USERNAME: z.string(),
  NEXT_PUBLIC_MQTT_PASSWORD: z.string()
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  NEXT_PUBLIC_API_ENDPOINT_URL: process.env.NEXT_PUBLIC_API_ENDPOINT_URL,
  NEXT_PUBLIC_API_MEDIA_URL: process.env.NEXT_PUBLIC_API_MEDIA_URL,
  NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL:
    process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_MEDIA_HOST: process.env.NEXT_PUBLIC_MEDIA_HOST,
  NEXT_PUBLIC_CLIENT_TYPE: process.env.NEXT_PUBLIC_CLIENT_TYPE,
  NEXT_PUBLIC_MQTT_BROKER: process.env.NEXT_PUBLIC_MQTT_BROKER,
  NEXT_PUBLIC_MQTT_USERNAME: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  NEXT_PUBLIC_MQTT_PASSWORD: process.env.NEXT_PUBLIC_MQTT_PASSWORD
});

if (!configProject.success) {
  logger.error('[ENV_CONFIG_ERROR]', configProject.error);
  throw new Error('Missing environment variables');
}

export const envConfig = configProject.data;
