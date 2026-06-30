'use client';

import { DEFAULT_PAGE_SIZE, ErrorCode } from '@/constants';
import { ListHeading } from '@/components/app/heading';
import { MovieGrid } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryQuery, useMovieListQuery } from '@/queries';
import { useQueryParams } from '@/hooks';
import { NotFound } from './not-found';

type MovieListProps = {
  id: string;
};

export function MovieList({ id }: MovieListProps) {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryQuery(id);

  const category = categoryData?.data;
  const errorCode = categoryData?.code;

  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        categoryIds: id,
        size: DEFAULT_PAGE_SIZE
      },
      enabled: !!id
    });

  const movieList = movieListData?.content || [];
  const totalPages = movieListData?.totalPages || 0;

  if (errorCode === ErrorCode.CATEGORY_ERROR_NOT_FOUND) {
    return <NotFound />;
  }

  if (categoryLoading || movieListLoading || !category) {
    return <MovieList.Skeleton />;
  }

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <ListHeading title={category.name} />
      {movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào trong thể loại&nbsp;
              <b>{category.name}</b>
              <br />
              Bạn thử xem thể loại khác nhé 😊
            </>
          }
        />
      ) : (
        <MovieGrid
          className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4'
          movieList={movieList}
        />
      )}
      {!!totalPages && <Pagination totalPages={totalPages} />}
    </div>
  );
}

MovieList.Skeleton = function MovieListSkeleton() {
  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <Skeleton className='skeleton max-640:mb-4 max-480:mb-2 max-640:h-8 mb-6 h-10 w-50' />
      <MovieGrid.Skeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
    </div>
  );
};
