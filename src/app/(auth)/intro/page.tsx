import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { IntroForm } from '@/app/(auth)/intro/_components';
import type { Metadata } from 'next';
import { envConfig } from '@/config';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description:
    'Tìm hiểu thêm về MovieHub - nền tảng xem phim trực tuyến miễn phí hàng đầu Việt Nam.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['giới thiệu moviehub', 'về chúng tôi', 'moviehub vietnam'],
  alternates: {
    canonical: '/intro'
  },
  openGraph: {
    title: 'Giới thiệu | MovieHub',
    description:
      'Tìm hiểu về MovieHub - nền tảng xem phim trực tuyến miễn phí.',
    url: '/intro',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/logo.webp',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'MovieHub'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Giới thiệu | MovieHub',
    description:
      'Tìm hiểu về MovieHub - nền tảng xem phim trực tuyến miễn phí.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function IntroPage() {
  return <IntroForm />;
}
