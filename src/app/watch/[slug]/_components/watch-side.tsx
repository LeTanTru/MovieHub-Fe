'use client';

import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function WatchSide() {
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  return <div></div>;
}
