'use client';

import { useCategoryQuery, useMovieListQuery } from '@/queries';
import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { Activity } from '@/components/activity';
import { Pagination } from '@/components/pagination';

export default function MovieList({ id }: { id: string }) {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryQuery(id);

  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        categoryIds: id,
        size: DEFAULT_PAGE_SIZE
      },
      enabled: !!id
    });

  const category = categoryData?.data;
  const movieList = movieListData?.data?.content || [];
  const totalPages = movieListData?.data?.totalPages || 0;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      {categoryLoading ? (
        <Skeleton className='skeleton mb-6 h-10 w-50' />
      ) : (
        <div className='relative mb-5 flex min-h-11 items-center justify-start gap-4'>
          <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
            {category?.name}
          </h3>
        </div>
      )}
      {movieListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData
          className='pt-20 pb-40'
          content={
            <>
              Không có phim nào trong danh mục&nbsp;
              <span className='font-medium'>{category?.name}</span>
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
