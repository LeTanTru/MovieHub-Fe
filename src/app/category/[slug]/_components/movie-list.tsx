'use client';

import { useCategoryQuery, useMovieListQuery } from '@/queries';
import { CategoryResType, MovieResType } from '@/types';
import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';

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
      enabled: true
    });

  const category: CategoryResType | undefined = categoryData?.data;
  const movieList: MovieResType[] = movieListData?.data?.content || [];

  return (
    <div className='max-989:mb-2.5 mb-5'>
      {categoryLoading ? (
        <Skeleton className='skeleton m-0 mb-6 h-10 w-50' />
      ) : (
        <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          {category?.name}
        </h3>
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
    </div>
  );
}
