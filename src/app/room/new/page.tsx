import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { envConfig } from '@/config';
import { getQueryClient } from '@/components/providers/query-provider';
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import type { Metadata } from 'next';
import { NewRoom } from '@/app/room/new/_components';

export const metadata: Metadata = {
  title: 'Tạo phòng mới',
  description:
    'Tạo phòng xem chung mới và mời bạn bè cùng thưởng thức phim theo thời gian thực trên MovieHub.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'tạo phòng xem chung',
    'phòng xem phim mới',
    'watch party',
    'moviehub tạo phòng'
  ],
  alternates: {
    canonical: '/room/new'
  },
  openGraph: {
    title: 'Tạo phòng mới | MovieHub',
    description:
      'Tạo phòng xem chung mới và mời bạn bè cùng thưởng thức phim theo thời gian thực trên MovieHub.',
    url: '/room/new',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/room-cover.webp',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'MovieHub - Tạo phòng xem chung'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tạo phòng mới | MovieHub',
    description:
      'Tạo phòng xem chung mới và mời bạn bè cùng thưởng thức phim theo thời gian thực trên MovieHub.',
    images: ['/room-cover.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function NewPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative flex flex-col gap-16 py-40'>
        <NewRoom />
      </Container>
    </HydrationBoundary>
  );
}
