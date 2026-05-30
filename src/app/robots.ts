import { envConfig } from '@/config';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/user/',
        '/account/',
        '/api/',
        '/auth/',
        '/_next/',
        '/search',
        '/login',
        '/register',
        '/forgot-password',
        '/verify-otp',
        '/intro',
        '/survey'
      ]
    },
    sitemap: `${envConfig.NEXT_PUBLIC_URL}/sitemap.xml`
  };
}
