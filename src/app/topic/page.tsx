import { collectionApiRequest } from '@/api-requests';
import { TopicList } from '@/app/topic/_components';
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
    queryFn: () => collectionApiRequest.getTopicList({ params: defaultFilters })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopicList />
    </HydrationBoundary>
  );
}
