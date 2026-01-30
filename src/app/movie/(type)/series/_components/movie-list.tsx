'use client';

import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { movieKinds } from '@/constants';
import { useMovieListQuery } from '@/queries';
import { MovieResType } from '@/types';

export default function MovieList() {
  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: { type: movieKinds.MOVIE_KIND_SERIES },
      enabled: true
    });
  const movieList: MovieResType[] = movieListData?.data?.content || [];

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
        <MovieGrid movieList={movieList} dir={'up'} />
      )}
    </div>
  );
}
