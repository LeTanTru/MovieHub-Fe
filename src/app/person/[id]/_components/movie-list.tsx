'use client';

import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import {
  MAX_PAGE_SIZE,
  MOVIE_LIST_TAB_ALL,
  movieListActions,
  PERSON_KIND_ACTOR
} from '@/constants';
import { PersonSearchType } from '@/types';
import {
  MovieGrid,
  MovieGridByYear,
  MovieGridSkeleton
} from '@/components/app/movie-grid';
import { ButtonAction } from '@/components/app/button-action';
import { useParams } from 'next/navigation';
import { NoData } from '@/components/no-data';
import { useQueryParams } from '@/hooks';

export default function MovieList() {
  const { id } = useParams<{ id: string }>();
  const [activeKey, setActiveKey] = useState<string>(MOVIE_LIST_TAB_ALL);
  const { searchParams } = useQueryParams<PersonSearchType>();

  const { data: moviePersonListData, isLoading: movieListLoading } =
    useMoviePersonListQuery({
      params: {
        personId: id,
        kind: searchParams.kind || PERSON_KIND_ACTOR,
        size: MAX_PAGE_SIZE
      },
      enabled: true
    });

  const moviePersonList = moviePersonListData?.data?.content || [];

  const movieList = moviePersonList.map((moviePerson) => moviePerson.movie);

  return (
    <div className='grow'>
      <div className='border-b-transparent-white max-1120:border-none border-b border-solid'>
        <div className='max-1120:pl-0 pt-0 pb-10 pl-10'>
          <div className='max-1120:mb-5 max-640:mb-4 mb-6 flex items-center justify-between'>
            <h3 className='max-640:text-lg max-480:text-base items-center text-xl font-semibold'>
              Các phim đã tham gia
            </h3>
            {!movieListLoading && movieList.length > 0 && (
              <div
                className='relative flex shrink-0 items-stretch overflow-hidden rounded border border-solid border-white p-0.5 text-sm font-normal'
                role='tablist'
              >
                {movieListActions.map((action) => (
                  <ButtonAction
                    key={action.key}
                    label={action.label}
                    action={action.key}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                    className='max-640:text-[13px] max-480:text-xs max-640:py-1 max-640:px-1.5'
                  />
                ))}
              </div>
            )}
          </div>
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode='popLayout'>
              <m.div
                key={activeKey}
                initial={{
                  opacity: 0,
                  y: activeKey === MOVIE_LIST_TAB_ALL ? -10 : 10
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: activeKey === MOVIE_LIST_TAB_ALL ? -10 : 10
                }}
                className='block'
              >
                {movieListLoading ? (
                  <MovieGridSkeleton
                    className='max-1600:gap-4 max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-x-2 max-640:gap-y-6 max-480:grid-cols-2 grid-cols-6 gap-6'
                    skeletonCount={12}
                  />
                ) : movieList.length === 0 ? (
                  <NoData
                    className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
                    imageClassName='max-640:size-40 max-480:size-30'
                    content='Diễn viên này chưa tham gia phim nào'
                  />
                ) : activeKey === MOVIE_LIST_TAB_ALL ? (
                  <MovieGrid
                    movieList={movieList}
                    dir='down'
                    className='max-1600:gap-4 max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-x-2 max-640:gap-y-6 max-480:grid-cols-2 grid-cols-6 gap-6'
                  />
                ) : (
                  <MovieGridByYear
                    movieList={movieList}
                    className='max-1600:gap-4 max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-x-2 max-640:gap-y-6 max-480:grid-cols-2 grid-cols-6 gap-6'
                  />
                )}
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}
