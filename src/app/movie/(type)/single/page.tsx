import { movieApiRequest } from '@/api-requests';
import { MovieList } from '@/app/movie/(type)/single/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers';
import {
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  movieTypes,
  queryKeys
} from '@/constants';
import { MovieSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phim lẻ',
  description: 'Danh sách phim lẻ mới nhất, cập nhật nhanh nhất.'
};

export default async function MovieSinglePage() {
  const defaultFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    type: movieTypes.MOVIE_TYPE_SINGLE,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, defaultFilters],
    queryFn: () => movieApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='flex flex-col gap-12.5'>
          <MovieList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
