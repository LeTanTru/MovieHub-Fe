import { collectionApiRequest, sidebarApiRequest } from '@/api-requests';
import { CollectionSearchType, SidebarSearchType } from '@/types';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { Slider } from '@/app/(home)/_components/slider';
import { TopicList } from '@/app/(home)/_components/topic-list';
import { WatchContinue } from '@/app/(home)/_components/watch-continue';
import type { Metadata } from 'next';
import { Collection } from '@/app/(home)/_components/collection';

export const metadata: Metadata = {
  description:
    'Xem phim trực tuyến miễn phí với chất lượng cao tại MovieHub. Khám phá kho phim đa dạng, từ hành động, hài hước đến lãng mạn. Trải nghiệm xem phim mượt mà trên mọi thiết bị, không quảng cáo phiền phức. Cập nhật phim mới hàng ngày, đảm bảo bạn luôn có những lựa chọn giải trí tốt nhất. Thưởng thức thế giới điện ảnh tại MovieHub ngay hôm nay !'
};

export default async function HomePage() {
  const queryClient = getQueryClient();

  const sidebarFilters: SidebarSearchType = {};

  const defaultFilters: CollectionSearchType = {
    size: MAX_PAGE_SIZE
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.SIDEBAR_LIST, sidebarFilters],
      queryFn: () => sidebarApiRequest.getList(sidebarFilters)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION_TOPIC_LIST, defaultFilters],
      queryFn: () => collectionApiRequest.getTopicList(defaultFilters)
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Slider />
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
        <div className='flex flex-col gap-12.5'>
          <TopicList />
          <WatchContinue />
          <Collection />
        </div>
      </Container> */}
    </HydrationBoundary>
  );
}
