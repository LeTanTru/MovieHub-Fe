'use client';

import { useShallow } from 'zustand/shallow';
import WatchSeries from './watch-series';
import WatchSingle from './watch-single';
import { MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovieStore } from '@/store';

export default function WatchEpisode() {
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? WatchSingle
      : WatchSeries
    : null;

  if (!movie) return null;

  return <>{Tab ? <Tab /> : null}</>;
}
