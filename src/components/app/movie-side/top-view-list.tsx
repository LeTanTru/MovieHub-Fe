'use client';

import { FallingStarIcon } from '@/assets';
import TopViewItem from './top-view-item';
import { useTopViewMovieListQuery } from '@/queries';

export default function TopViewList() {
  const { data: topViewMovieListData } = useTopViewMovieListQuery({
    enabled: true
  });
  const topViewMovieList = topViewMovieListData?.data?.content || [];

  if (topViewMovieList.length === 0) return null;

  return (
    <div className='max-1120:hidden border-t border-solid border-white/10 pt-8'>
      <div className='mb-4 flex min-h-10 items-center gap-4 text-xl font-semibold text-white'>
        <div className='size-6 shrink-0'>
          <FallingStarIcon className='size-full' />
        </div>
        Top phim tuần này
      </div>
      <div className='top-view-list flex flex-col gap-4'>
        {topViewMovieList.map((movie, index) => (
          <TopViewItem key={movie.id} movie={movie} index={index + 1} />
        ))}
      </div>
    </div>
  );
}
