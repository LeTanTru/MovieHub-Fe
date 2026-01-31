'use client';

import { Activity } from '@/components/activity';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import Pagination from '@/components/pagination';
import { DEFAULT_PAGE_SIZE, movieKinds } from '@/constants';
import { useQueryParams } from '@/hooks';
import { useMovieListQuery } from '@/queries';
import { MovieResType } from '@/types';

export default function MovieList() {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        type: movieKinds.MOVIE_KIND_SERIES,
        size: DEFAULT_PAGE_SIZE
      },
      enabled: true
    });

  const movieList: MovieResType[] = movieListData?.data?.content || [];
  const totalPages: number = movieListData?.data?.totalPages || 0;

  return (
    <div className='max-989:mb-2.5 mb-5'>
      <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        Phim bộ
      </h3>
      {movieListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData />
      ) : (
        <MovieGrid movieList={movieList} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
