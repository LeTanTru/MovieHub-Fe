import { Collection } from '@/app/(home)/_components/collection';
import { collectionApiRequest, sidebarApiRequest } from '@/api-requests';
import { CollectionSearchType, SidebarSearchType } from '@/types';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { Slider } from '@/app/(home)/_components/slider';
import { SuggestByWatched } from '@/app/(home)/_components/suggest-by-watched';
import { TopicList } from '@/app/(home)/_components/topic-list';
import { WatchContinue } from '@/app/(home)/_components/watch-continue';
import envConfig from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Xem phim trực tuyến miễn phí với chất lượng cao tại MovieHub. Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày.',
  openGraph: {
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày tại MovieHub.',
    url: envConfig.NEXT_PUBLIC_URL,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày tại MovieHub.',
    images: [`${envConfig.NEXT_PUBLIC_URL}/logo.webp`]
  },
  alternates: {
    canonical: envConfig.NEXT_PUBLIC_URL
  }
};

export default async function HomePage() {
  const queryClient = getQueryClient();

  const sidebarFilters: SidebarSearchType = {};

  const collectionFilters: CollectionSearchType = {
    size: MAX_PAGE_SIZE
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.SIDEBAR_LIST, sidebarFilters],
      queryFn: () => sidebarApiRequest.getList(sidebarFilters)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION_TOPIC_LIST, collectionFilters],
      queryFn: () => collectionApiRequest.getTopicList(collectionFilters)
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Slider />
      <Container className='max-990:pb-24 max-640:pb-20 relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <TopicList />
          <SuggestByWatched />
          <WatchContinue />
          <Collection />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
