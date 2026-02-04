import type { NextConfig } from 'next';
import createBundleAnalyzer from '@next/bundle-analyzer';
import envConfig from '@/config';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
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
  outputFileTracingRoot: path.join(__dirname)
  // reactCompiler: true
};

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer(nextConfig);
