'use client';

import { Activity } from '@/components/activity';
import { useCategoryQuery, useMovieListQuery } from '@/queries';

export default function CategoryList({ id }: { id: string }) {
  const { data: categoryData, isLoading: categoryLoading } =
    useCategoryQuery(id);
  const category = categoryData?.data;
  const { data: movieListData } = useMovieListQuery({ categoryIds: id }, !!id);
  const movieList = movieListData?.data?.content || [];

  return (
    <div className='max-989:mb-2.5 mb-5'>
      {categoryLoading ? (
        <h3 className='max-1600:text-2xl skeleton m-0 h-8 w-30 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'></h3>
      ) : (
        <h3 className='max-1600:text-2xl m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          <Activity visible={!!category}>{category?.name}</Activity>
        </h3>
      )}
    </div>
  );
}
