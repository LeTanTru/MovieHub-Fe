'use client';

import { useMovieStore } from '@/store';
import WatchPlayer from './watch-player';
import WatchInfo from './watch-info';
import { useShallow } from 'zustand/shallow';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useEffect, useMemo } from 'react';
import { MoviePersonResType, MovieResType } from '@/types';

export default function Watch({ id }: { id: string }) {
  const { setMovie, setMoviePersons } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePersons: s.setMoviePersons
    }))
  );
  const { data: movieData, isLoading: movieLoading } = useMovieQuery(id);
  const movie: MovieResType | undefined = movieData?.data;

  const { data: moviePersonData } = useMoviePersonListQuery({
    params: {
      movieId: id
    },
    enabled: !!movie
  });

  const moviePersons: MoviePersonResType[] = useMemo(
    () => moviePersonData?.data?.content || [],
    [moviePersonData?.data?.content]
  );

  useEffect(() => {
    if (!movie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [movie]);

  useEffect(() => {
    setMovie(movie);
    setMoviePersons(moviePersons);
  }, [movie, moviePersons, setMovie, setMoviePersons]);

  if (!movie) return null;

  return (
    <>
      <h1 style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {`${movie.title} - ${movie.originalTitle}`}
      </h1>
      <WatchPlayer />
      <WatchInfo />
    </>
  );
}
