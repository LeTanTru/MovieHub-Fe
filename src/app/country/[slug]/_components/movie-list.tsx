'use client';

import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { useMovieListQuery } from '@/queries';
import { countries, DEFAULT_PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { Activity } from '@/components/activity';
import { Pagination } from '@/components/pagination';
import { ListHeading } from '@/components/app/heading';

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
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <ListHeading title={`Phim ${countryName}`} />
      {movieListLoading ? (
        <MovieGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào trong từ quốc gia&nbsp;
              <span className='font-semibold'>{countryName}</span>
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
