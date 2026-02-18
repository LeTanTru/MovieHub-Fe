'use client';

import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
      <div className='border-b-transparent-white border-b border-solid'>
        <div className='pt-0 pb-10 pl-10'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            <div className='text-xl leading-1.5 font-semibold text-white'>
              Các phim đã tham gia
            </div>
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
                  />
                ))}
              </div>
            )}
          </div>
          <AnimatePresence mode='popLayout'>
            <motion.div
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
                <MovieGridSkeleton className='grid-cols-6' skeletonCount={12} />
              ) : movieList.length === 0 ? (
                <NoData
                  className='pt-20 pb-40'
                  content='Diễn viên này chưa tham gia phim nào'
                />
              ) : activeKey === MOVIE_LIST_TAB_ALL ? (
                <MovieGrid
                  movieList={movieList}
                  dir='down'
                  className='grid-cols-6'
                />
              ) : (
                <MovieGridByYear
                  movieList={movieList}
                  className='grid-cols-6'
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
