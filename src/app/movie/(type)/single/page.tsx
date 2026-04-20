import { movieApiRequest } from '@/api-requests';
import { MovieList } from '@/app/movie/(type)/single/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  movieTypes,
  queryKeys
} from '@/constants';
import { MovieSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Phim lẻ',
  description: 'Danh sách phim lẻ mới nhất, cập nhật nhanh nhất.',
  openGraph: {
    title: 'Phim lẻ',
    description: 'Danh sách phim lẻ mới nhất, cập nhật nhanh nhất.',
    url: `${envConfig.NEXT_PUBLIC_URL}/movie/single`,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Phim lẻ',
    description: 'Danh sách phim lẻ mới nhất, cập nhật nhanh nhất.'
  },
  alternates: {
    canonical: `${envConfig.NEXT_PUBLIC_URL}/movie/single`
  }
};

export default async function MovieSinglePage() {
  const movieFilters: MovieSearchType = {
    page: DEFAULT_PAGE_START,
    type: movieTypes.MOVIE_TYPE_SINGLE,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, movieFilters],
    queryFn: () => movieApiRequest.getList(movieFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <MovieList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
