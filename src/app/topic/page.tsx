import { collectionApiRequest } from '@/api-requests';
import { TopicList } from '@/app/topic/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  MAX_PAGE_SIZE,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { CollectionSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { envConfig } from '@/config';

export const metadata: Metadata = {
  title: 'Chủ đề',
  description:
    'Khám phá các chủ đề phim được tuyển chọn đặc sắc trên MovieHub. Từ những bộ sưu tập phim hành động kịch tính đến những tuyển tập phim tình cảm lãng mạn, đáp ứng mọi sở thích của bạn.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['chủ đề phim', 'bộ sưu tập phim', 'tuyển tập phim hay'],
  openGraph: {
    title: 'Chủ đề phim',
    description:
      'Khám phá các chủ đề phim được tuyển chọn đặc sắc trên MovieHub. Từ những bộ sưu tập phim hành động kịch tính đến những tuyển tập phim tình cảm lãng mạn, đáp ứng mọi sở thích của bạn.',
    url: '/topic',
    type: 'website',
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
    title: 'Chủ đề phim',
    description:
      'Khám phá các chủ đề phim được tuyển chọn đặc sắc trên MovieHub. Từ những bộ sưu tập phim hành động kịch tính đến những tuyển tập phim tình cảm lãng mạn, đáp ứng mọi sở thích của bạn.',
    images: ['/logo.webp']
  },
  alternates: {
    canonical: '/topic'
  }
};

export default async function TopicPage() {
  const queryClient = getQueryClient();
  const movieFilters: CollectionSearchType = {
    size: MAX_PAGE_SIZE
  };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COLLECTION_TOPIC_LIST, movieFilters],
    queryFn: () => collectionApiRequest.getTopicList(movieFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <TopicList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
