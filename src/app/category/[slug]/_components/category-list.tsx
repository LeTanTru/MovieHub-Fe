'use client';

import MovieGridSkeleton from './movie-grid-skeleton';
import MovieGrid from './movie-grid';
import { useCategoryQuery, useMovieListQuery } from '@/queries';
import { CategoryResType, MovieResType } from '@/types';
import { NoData } from '@/components/no-data';

export default function CategoryList({ id }: { id: string }) {
  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryQuery(id);
  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({ categoryIds: id }, !!id);

  const category: CategoryResType | undefined = categoryData?.data;
  const movieList: MovieResType[] = movieListData?.data?.content || [];

  return (
    <div className='max-989:mb-2.5 mb-5'>
      {categoryLoading ? (
        <div className='skeleton m-0 h-10 w-50'></div>
      ) : (
        <h3 className='max-1600:text-2xl m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          {category?.name}
        </h3>
      )}
      {movieListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData />
      ) : (
        <MovieGrid movieList={movieList} dir={'up'} />
      )}
    </div>
  );
}
