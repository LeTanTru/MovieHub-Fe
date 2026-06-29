import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import { RoomList } from '@/app/room/manage/_components';
import { envConfig } from '@/config';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản lý phòng xem phim',
  description:
    'Quản lý các phòng xem phim của bạn trên MovieHub — tạo, chỉnh sửa và theo dõi phòng xem phim cùng bạn bè.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['quản lý phòng', 'phòng xem phim', 'watch party', 'moviehub'],
  openGraph: {
    title: 'Quản lý phòng xem phim — MovieHub',
    description: 'Quản lý các phòng xem phim của bạn trên MovieHub.',
    url: '/room/manage'
  },
  twitter: {
    card: 'summary',
    title: 'Quản lý phòng xem phim — MovieHub',
    description: 'Quản lý các phòng xem phim của bạn trên MovieHub.'
  },
  alternates: {
    canonical: '/room/manage'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function RoomManagePage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative flex flex-col gap-16 py-40'>
        <RoomList />
      </Container>
    </HydrationBoundary>
  );
}
