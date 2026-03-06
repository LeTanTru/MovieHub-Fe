'use client';

import { NoData } from '@/components/no-data';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { Activity } from '@/components/activity';
import { Pagination } from '@/components/pagination';
import { MovieResType } from '@/types';
import { Element } from 'react-scroll';
import { SEARCH_MOVIE_LIST_ID } from '@/constants';

export default function MovieList({
  movieList,
  isLoading,
  totalPages,
  listKey,
  keyword
}: {
  movieList: MovieResType[];
  isLoading: boolean;
  totalPages: number;
  listKey?: string;
  keyword?: string;
}) {
  return (
    <Element name={SEARCH_MOVIE_LIST_ID}>
      {isLoading ? (
        <MovieGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : movieList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có phim nào tương ứng với từ khóa&nbsp;
              <span className='font-semibold'>{keyword}</span>
            </>
          }
        />
      ) : (
        <MovieGrid
          className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4'
          key={listKey}
          movieList={movieList}
        />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </Element>
  );
}
