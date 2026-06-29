import { Room } from '@/app/room/[slug]/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { BreadcrumbListJsonLd } from '@/components/seo';
import { envConfig } from '@/config';
import { getIdFromSlug } from '@/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Phòng xem phim',
  description:
    'Tham gia phòng xem phim trực tuyến cùng bạn bè trên MovieHub. Cùng thưởng thức phim yêu thích và trò chuyện theo thời gian thực.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'phòng xem phim',
    'watch party',
    'xem phim cùng bạn bè',
    'moviehub'
  ],
  openGraph: {
    title: 'Phòng xem phim — MovieHub',
    description:
      'Tham gia phòng xem phim trực tuyến cùng bạn bè trên MovieHub.',
    url: '/room'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phòng xem phim — MovieHub',
    description: 'Tham gia phòng xem phim trực tuyến cùng bạn bè trên MovieHub.'
  },
  robots: {
    index: false,
    follow: false
  }
};

type RoomPageProps = { params: Promise<{ slug: string }> };

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const queryClient = getQueryClient();

  const breadcrumbItems = [
    { name: 'Trang chủ', item: envConfig.NEXT_PUBLIC_URL },
    {
      name: 'Phòng xem phim',
      item: `${envConfig.NEXT_PUBLIC_URL}/room/${id}`
    }
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
      <Container className='bg-vulcan min-h-page-height pt-header relative flex flex-col gap-16'>
        <Room />
      </Container>
    </HydrationBoundary>
  );
}
