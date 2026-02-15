'use client';

import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function WatchMain() {
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  if (!movie) return null;

  return <div></div>;
}
