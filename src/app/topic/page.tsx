import { collectionApiRequest } from '@/api-requests';
import { TopicList } from '@/app/topic/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { CollectionSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Chủ đề',
  description: 'Khám phá các chủ đề phim được tuyển chọn trên MovieHub.',
  openGraph: {
    title: 'Chủ đề phim',
    description: 'Khám phá các chủ đề phim được tuyển chọn trên MovieHub.',
    url: `${envConfig.NEXT_PUBLIC_URL}/topic`,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Chủ đề phim',
    description: 'Khám phá các chủ đề phim được tuyển chọn trên MovieHub.'
  },
  alternates: {
    canonical: `${envConfig.NEXT_PUBLIC_URL}/topic`
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
