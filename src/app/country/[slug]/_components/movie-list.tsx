'use client';

import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { useMovieListQuery } from '@/queries';
import { countries, DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { Activity } from '@/components/activity';
import { Pagination } from '@/components/pagination';

export default function MovieList({ countryCode }: { countryCode: string }) {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const countryName = countries.find(
    (country) => country.value === countryCode
  )?.label;

  const { data: movieListData, isLoading: movieListLoading } =
    useMovieListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        country: countryCode,
        size: DEFAULT_PAGE_SIZE
      },
      enabled: !!countryCode
    });

  const movieList = movieListData?.data?.content || [];
  const totalPages = movieListData?.data?.totalPages || 0;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Phim {countryName}
        </h3>
      </div>
      {movieListLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData
          className='pt-20 pb-40'
          content={
            <>
              Không có phim nào trong từ quốc gia&nbsp;
              <span className='font-medium'>{countryName}</span>
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
