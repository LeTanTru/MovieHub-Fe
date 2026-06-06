import { collectionApiRequest, sidebarApiRequest } from '@/api-requests';
import {
  CollectionSearchType,
  SidebarResType,
  SidebarSearchType
} from '@/types';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  MAX_PAGE_SIZE,
  queryKeys,
  SUGGEST_BY_WATCHED_PAGE_0,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { Collection } from '@/app/(home)/_components/collection';
import { envConfig } from '@/config';
import { Recommendation } from '@/app/(home)/_components/recommendation';
import { Slider } from '@/app/(home)/_components/slider';
import { SuggestByWatched } from '@/app/(home)/_components/suggest-by-watched';
import { TopicList } from '@/app/(home)/_components/topic-list';
import { WatchContinue } from '@/app/(home)/_components/watch-continue';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Xem phim trực tuyến miễn phí với chất lượng cao tại MovieHub. Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'phim',
    'phim hay',
    'xem phim',
    'xem phim trực tuyến',
    'moviehub',
    'phim mới',
    'phim vietsub',
    'phim lẻ',
    'phim bộ'
  ],
  openGraph: {
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày tại MovieHub.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/og',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'MovieHub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHub - Xem phim trực tuyến miễn phí',
    description:
      'Khám phá kho phim đa dạng, cập nhật phim mới hàng ngày tại MovieHub.',
    images: ['/og']
  },
  alternates: {
    canonical: '/'
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
      queryFn: ({ signal }) => sidebarApiRequest.getList(sidebarFilters, signal)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION_TOPIC_LIST, collectionFilters],
      queryFn: ({ signal }) =>
        collectionApiRequest.getTopicList(collectionFilters, signal)
    })
  ]);

  const sidebarRes = queryClient.getQueryData<{
    data: { content: SidebarResType[] };
  }>([queryKeys.SIDEBAR_LIST, sidebarFilters]);

  const sidebarList = sidebarRes?.data?.content || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Slider sidebarList={sidebarList} />
      <Container className='max-990:pb-24 max-640:pb-20 relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <TopicList />
          <WatchContinue />
          <SuggestByWatched page={SUGGEST_BY_WATCHED_PAGE_0} />
          <Recommendation />
          <Collection />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
