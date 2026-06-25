import { RoomHero, RoomList } from '@/app/room/_components';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { envConfig } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem chung',
  description:
    'Tham gia phòng xem chung và thưởng thức phim cùng bạn bè theo thời gian thực trên MovieHub.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'xem chung',
    'phòng xem phim',
    'xem phim cùng bạn',
    'watch party',
    'moviehub xem chung'
  ],
  alternates: {
    canonical: '/room'
  },
  openGraph: {
    title: 'Xem chung | MovieHub',
    description:
      'Tham gia phòng xem chung và thưởng thức phim cùng bạn bè theo thời gian thực trên MovieHub.',
    url: '/room',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/room-cover.webp',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'MovieHub - Xem chung'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xem chung | MovieHub',
    description:
      'Tham gia phòng xem chung và thưởng thức phim cùng bạn bè theo thời gian thực trên MovieHub.',
    images: ['/room-cover.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function RoomPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative flex flex-col gap-16 py-40'>
        <RoomHero />
        <RoomList />
      </Container>
    </HydrationBoundary>
  );
}
