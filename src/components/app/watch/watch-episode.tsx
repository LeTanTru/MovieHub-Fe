'use client';

import { useShallow } from 'zustand/shallow';
import WatchEpisodeSeries from './watch-episode-series';
import WatchEpisodeSingle from './watch-episode-single';
import { MOVIE_TYPE_SINGLE } from '@/constants';
import { useMovieStore } from '@/store';

export default function WatchEpisode() {
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const Tab = movie
    ? movie.type === MOVIE_TYPE_SINGLE
      ? WatchEpisodeSingle
      : WatchEpisodeSeries
    : null;

  if (!movie) return null;

  return <>{Tab ? <Tab /> : null}</>;
}
