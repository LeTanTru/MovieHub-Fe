'use client';

import { Activity } from '@/components/activity';
import { ListHeading } from '@/components/app/heading';
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
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <ListHeading title='Phim bộ' />
      {movieListLoading ? (
        <MovieGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào trong danh mục&nbsp;
              <span className='font-semibold'>Phim bộ</span>
            </>
          }
        />
      ) : (
        <MovieGrid
          className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4'
          movieList={movieList}
        />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
