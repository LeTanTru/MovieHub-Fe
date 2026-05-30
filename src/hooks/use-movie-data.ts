'use client';

import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export const useMovie = () =>
  useMovieStore(useShallow((s) => ({ movie: s.movie })));
