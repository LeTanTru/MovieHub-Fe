'use client';

import MotionWrapper from './motion-wrapper';
import { MOVIE_TAB_EPISODE, MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import MovieTabSingle from './movie-tab-single';
import MovieTabSeries from './movie-tab-series';

export default function MovieTabEpisode({
  direction = 0,
  className
}: {
  direction?: number;
  className?: string;
}) {
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? MovieTabSingle
      : MovieTabSeries
    : null;

  if (!movie) return null;

  return (
    <MotionWrapper
      uniqueKey={MOVIE_TAB_EPISODE}
      direction={direction}
      className={className}
    >
      {Tab && <Tab movie={movie} />}
    </MotionWrapper>
  );
}
