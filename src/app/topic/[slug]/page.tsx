import { collectionApiRequest, collectionItemApiRequest } from '@/api-requests';
import { MovieList } from '@/app/topic/[slug]/_components';
import { getQueryClient } from '@/components/providers';
import { DEFAULT_PAGE_SIZE, queryKeys } from '@/constants';
import { CollectionItemSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function generateStaticParams() {
  const topicList = await collectionApiRequest.getTopicList({
    params: { size: DEFAULT_PAGE_SIZE }
  });
  return topicList.data.content.map((topic) => ({
    slug: `${topic.name}.${topic.id}`
  }));
}

export default async function TopicDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CollectionItemSearchType>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const collectionId = slug.split('.')[1];
  const queryClient = getQueryClient();

  const defaultFilters: CollectionItemSearchType = {
    collectionId,
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    ...filters
  };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COLLECTION_ITEM_LIST, defaultFilters],
    queryFn: () =>
      collectionItemApiRequest.getList({
        params: defaultFilters
      })
  });

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COLLECTION, collectionId],
    queryFn: () => collectionApiRequest.getById({ id: collectionId })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieList collectionId={collectionId} />
    </HydrationBoundary>
  );
}
