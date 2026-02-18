'use client';

import { useMovieStore } from '@/store';
import WatchPlayer from './watch-player';
import WatchContainer from './watch-container';
import { useShallow } from 'zustand/shallow';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useEffect, useMemo } from 'react';

export default function Watch({ id }: { id: string }) {
  const { setMovie, setMoviePersons } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePersons: s.setMoviePersons
    }))
  );
  const { data: movieData, isLoading: movieLoading } = useMovieQuery(id);
  const movie = movieData?.data;

  const { data: moviePersonData } = useMoviePersonListQuery({
    params: {
      movieId: id
    },
    enabled: !!movie
  });

  const moviePersons = useMemo(
    () => moviePersonData?.data?.content || [],
    [moviePersonData?.data?.content]
  );

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
      <WatchContainer />
    </>
  );
}
