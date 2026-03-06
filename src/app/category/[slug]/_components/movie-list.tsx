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
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      {categoryLoading ? (
        <Skeleton className='skeleton max-640:mb-4 max-480:mb-2 max-640:h-8 mb-6 h-10 w-50' />
      ) : (
        <div className='max-1120:mb-5 max-990:mb-4 max-640:mb-3 max-480:mb-2 mb-6'>
          <h3 className='max-990:text-2xl max-640:text-[22px] max-480:text-xl text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
            {category?.name}
          </h3>
        </div>
      )}
      {movieListLoading ? (
        <MovieGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào trong danh mục&nbsp;
              <span className='font-semibold'>{category?.name}</span>
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
