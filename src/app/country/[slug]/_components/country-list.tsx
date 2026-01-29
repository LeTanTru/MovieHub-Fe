'use client';

import { MovieResType } from '@/types';
import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { useMovieListQuery } from '@/queries';
import { countryOptions } from '@/constants';

export default function CountryList({ countryCode }: { countryCode: string }) {
  const countryName = countryOptions.find(
    (country) => country.value === countryCode
  )?.label;
  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({ country: countryCode }, true);
  const movieList: MovieResType[] = movieListData?.data?.content || [];

  return (
    <div className='max-989:mb-2.5 mb-5'>
      <h3 className='max-1600:text-2xl m-0 mb-6 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        {countryName}
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
