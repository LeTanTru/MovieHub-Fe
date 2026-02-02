'use client';
import { useMoviePersonListQuery } from '@/queries';
import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { MAX_PAGE_SIZE, PERSON_ACTOR } from '@/constants';
import { MoviePersonResType, MovieResType } from '@/types';
import {
  MovieGrid,
  MovieGridByYear,
  MovieGridSkeleton
} from '@/components/app/movie-grid';
import { ActionButton } from '@/components/app/action-button';

export default function MovieList({ id }: { id: string }) {
  const actions: { key: string; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'time', label: 'Thời gian' }
  ];
  const [activeKey, setActiveKey] = useState<string>(actions[0].key);

  const { data: moviePersonListData, isLoading: movieListLoading } =
    useMoviePersonListQuery({
      params: {
        personId: id,
        kind: PERSON_ACTOR,
        size: MAX_PAGE_SIZE
      },
      enabled: true
    });

  const moviePersonList: MoviePersonResType[] =
    moviePersonListData?.data?.content || [];

  const movieList: MovieResType[] = moviePersonList.map(
    (moviePerson) => moviePerson.movie
  );

  return (
    <div className='grow'>
      <div className='border-b-transparent-white border-b border-solid'>
        <div className='max-1120:pl-0 pt-0 pb-10 pl-10'>
          <div className='max-1120:mb-4 mb-8 flex items-center justify-between gap-8'>
            <div className='max-1120:text-xl mb-0 text-xl leading-1.5 font-semibold text-white max-sm:text-[16px]'>
              Các phim đã tham gia
            </div>
            {!movieListLoading && movieList.length > 0 && (
              <div
                className='relative flex shrink-0 items-stretch overflow-hidden rounded border border-solid border-white p-0.5 text-sm font-normal'
                role='tablist'
              >
                {actions.map((action) => (
                  <ActionButton
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
          <LayoutGroup>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: activeKey === 'all' ? -10 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: activeKey === 'all' ? -10 : 10 }}
                className='block'
              >
                {movieListLoading ? (
                  <MovieGridSkeleton
                    className='grid-cols-6'
                    skeletonCount={12}
                  />
                ) : movieList.length == 0 ? (
                  'Không có phim nào'
                ) : activeKey === 'all' ? (
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
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}
