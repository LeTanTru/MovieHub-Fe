'use client';

import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export const useMovieHydration = () =>
  useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePerson: s.setMoviePerson
    }))
  );
