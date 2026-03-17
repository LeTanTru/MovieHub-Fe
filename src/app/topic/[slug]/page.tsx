import { collectionApiRequest, collectionItemApiRequest } from '@/api-requests';
import { CollectionItemSearchType } from '@/types';
import { Container } from '@/components/layout';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_START, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getIdFromSlug } from '@/utils';
import { getQueryClient } from '@/components/providers/query-provider';
import { MovieList } from '@/app/topic/[slug]/_components';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  const topicList = await collectionApiRequest.getTopicList({
    size: DEFAULT_PAGE_SIZE
  });
  return topicList.data.content.map((topic) => ({
    slug: `${topic.name}.${topic.id}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const res = await collectionApiRequest.getById(id);
  const topic = res.data;

  return { title: topic?.name || 'Chủ đề' };
}

export default async function TopicDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collectionId = getIdFromSlug(slug);
  const queryClient = getQueryClient();

  const collectionItemFilters: CollectionItemSearchType = {
    collectionId,
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION, collectionId],
      queryFn: () => collectionApiRequest.getById(collectionId)
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION_ITEM_LIST, collectionItemFilters],
      queryFn: () => collectionItemApiRequest.getList(collectionItemFilters)
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList collectionId={collectionId} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
