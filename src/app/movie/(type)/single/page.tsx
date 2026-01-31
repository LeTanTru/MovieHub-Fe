import { movieApiRequest } from '@/api-requests';
import { MovieList } from '@/app/movie/(type)/single/_components';
import { getQueryClient } from '@/components/providers';
import {
  DEFALT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  MOVIE_KIND_SINGLE,
  queryKeys
} from '@/constants';
import { MovieSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phim lẻ'
};

export default async function MovieSinglePage({
  searchParams
}: {
  searchParams: Promise<MovieSearchType>;
}) {
  const filters = await searchParams;
  const defaultFilters: MovieSearchType = {
    page: DEFALT_PAGE_START,
    type: MOVIE_KIND_SINGLE,
    size: DEFAULT_PAGE_SIZE,
    ...filters
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [`${queryKeys.MOVIE}-list`, defaultFilters],
    queryFn: () => movieApiRequest.getList({ params: defaultFilters })
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieList />
    </HydrationBoundary>
  );
}
