'use client';

import { MotionWrapper } from './motion-wrapper';
import { MOVIE_TAB_EPISODE, MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovie } from '@/hooks';
import { MovieTabSingle } from './movie-tab-single';
import { MovieTabSeries } from './movie-tab-series';

type MovieTabEpisodeProps = {
  direction?: number;
  className?: string;
};

export function MovieTabEpisode({
  direction = 0,
  className
}: MovieTabEpisodeProps) {
  const { movie } = useMovie();

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
