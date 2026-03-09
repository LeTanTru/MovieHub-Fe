import { collectionApiRequest } from '@/api-requests';
import { TopicList } from '@/app/topic/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { CollectionSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chủ đề'
};

export default async function TopicPage() {
  const queryClient = getQueryClient();
  const defaultFilters: CollectionSearchType = {
    size: MAX_PAGE_SIZE
  };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COLLECTION_TOPIC_LIST, defaultFilters],
    queryFn: () => collectionApiRequest.getTopicList(defaultFilters)
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
