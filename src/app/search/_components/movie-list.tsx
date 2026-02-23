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
  listKey
}: {
  movieList: MovieResType[];
  isLoading: boolean;
  totalPages: number;
  listKey?: string;
}) {
  return (
    <Element name={SEARCH_MOVIE_LIST_ID}>
      {isLoading ? (
        <MovieGridSkeleton />
      ) : movieList.length === 0 ? (
        <NoData className='pt-20 pb-40' />
      ) : (
        <MovieGrid key={listKey} movieList={movieList} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </Element>
  );
}
