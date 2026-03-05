'use client';

import { Activity } from '@/components/activity';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Pagination } from '@/components/pagination';
import { DEFAULT_PAGE_SIZE, movieTypes } from '@/constants';
import { useQueryParams } from '@/hooks';
import { useMovieListQuery } from '@/queries';

export default function MovieList() {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        type: movieTypes.MOVIE_TYPE_SERIES,
        size: DEFAULT_PAGE_SIZE
      },
      enabled: true
    });

  const movieList = movieListData?.data?.content || [];
  const totalPages: number = movieListData?.data?.totalPages || 0;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='relative mb-5 flex min-h-11 items-center justify-start gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Phim bộ
        </h3>
      </div>
      {movieListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData
          className='pt-25 pb-40'
          content={
            <>
              Không có phim nào trong danh mục&nbsp;
              <span className='font-medium'>Phim bộ</span>
            </>
          }
        />
      ) : (
        <MovieGrid movieList={movieList} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
