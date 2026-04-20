import { Survey } from '@/app/survey/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khảo sát',
  description:
    'Tham gia khảo sát để giúp MovieHub cải thiện trải nghiệm xem phim.',
  openGraph: {
    title: 'Khảo sát',
    description:
      'Tham gia khảo sát để giúp MovieHub cải thiện trải nghiệm xem phim.',
    url: '/survey',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Khảo sát',
    description:
      'Tham gia khảo sát để giúp MovieHub cải thiện trải nghiệm xem phim.'
  },
  alternates: {
    canonical: '/survey'
  }
};

export default function SurveyPage() {
  return <Survey />;
}
