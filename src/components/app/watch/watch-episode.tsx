'use client';

import { WatchSeries } from './watch-series';
import { WatchSingle } from './watch-single';
import { MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovie } from '@/hooks';

export function WatchEpisode() {
  const { movie } = useMovie();

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? WatchSingle
      : WatchSeries
    : null;

  if (!movie) return null;

  return <>{Tab ? <Tab /> : null}</>;
}
