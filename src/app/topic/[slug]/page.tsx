import { ApiResponse, CollectionItemSearchType } from '@/types';
import { collectionApiRequest, collectionItemApiRequest } from '@/api-requests';
import { Container } from '@/components/layout';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_START, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getIdFromSlug } from '@/utils';
import { getQueryClient } from '@/components/providers';
import { MovieList } from '@/app/topic/[slug]/_components';
import { notFound } from 'next/navigation';
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

  const defaultFilters: CollectionItemSearchType = {
    collectionId,
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE
  };

  try {
    await queryClient.prefetchQuery({
      queryKey: [queryKeys.COLLECTION, collectionId],
      queryFn: () => collectionApiRequest.getById(collectionId)
    });

    const collectionData: ApiResponse<any> | undefined =
      queryClient.getQueryData([queryKeys.COLLECTION, collectionId]);

    if (!collectionData?.result) {
      notFound();
    }
  } catch (_) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.COLLECTION_ITEM_LIST, defaultFilters],
    queryFn: () => collectionItemApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='flex flex-col gap-12.5'>
          <MovieList collectionId={collectionId} />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
