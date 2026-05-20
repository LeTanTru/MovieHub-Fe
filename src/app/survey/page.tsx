import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { Survey } from '@/app/survey/_components';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Khảo sát',
  description:
    'Tham gia khảo sát ý kiến người dùng để giúp MovieHub cải thiện chất lượng dịch vụ và mang đến trải nghiệm xem phim tốt hơn. Ý kiến của bạn là đóng góp quý báu cho sự phát triển của chúng tôi.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['khảo sát moviehub', 'ý kiến người dùng', 'cải thiện dịch vụ'],
  alternates: {
    canonical: '/survey'
  },
  openGraph: {
    title: 'Khảo sát | MovieHub',
    description:
      'Tham gia khảo sát ý kiến người dùng để giúp MovieHub cải thiện chất lượng dịch vụ và mang đến trải nghiệm xem phim tốt hơn. Ý kiến của bạn là đóng góp quý báu cho sự phát triển của chúng tôi.',
    url: '/survey',
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
    card: 'summary_large_image',
    title: 'Khảo sát | MovieHub',
    description:
      'Tham gia khảo sát ý kiến người dùng để giúp MovieHub cải thiện chất lượng dịch vụ và mang đến trải nghiệm xem phim tốt hơn. Ý kiến của bạn là đóng góp quý báu cho sự phát triển của chúng tôi.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function SurveyPage() {
  return <Survey />;
}
