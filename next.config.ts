import type { NextConfig } from 'next';
import createBundleAnalyzer from '@next/bundle-analyzer';
import { envConfig } from '@/config';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920, 2048],
    imageSizes: [32, 48, 64, 96, 128, 192, 256],
    qualities: [50, 75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: envConfig.NEXT_PUBLIC_MEDIA_HOST,
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'static.nutscdn.com',
        pathname: '/**'
      }
    ]
  },
  outputFileTracingRoot: path.join(__dirname),
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['@vidstack/react'],
    optimizeCss: true
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'development'
        ? {
            exclude: ['log', 'error']
          }
        : false
  },
  async redirects() {
    return [];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
};

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer(nextConfig);
