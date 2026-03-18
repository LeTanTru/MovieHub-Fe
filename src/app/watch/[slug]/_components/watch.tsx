'use client';

import { useEffect, useMemo } from 'react';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import NotFound from './not-found';
import WatchContainer from './watch-container';
import WatchPlayer from './watch-player';
import WatchSkeleton from './watch-skeleton';

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
    if (movie) setMovie(movie);
  }, [movie, setMovie]);

  useEffect(() => {
    if (moviePersons.length > 0) setMoviePersons(moviePersons);
  }, [moviePersons, setMoviePersons]);

  if (movieLoading) return <WatchSkeleton />;

  if (!movie) return <NotFound />;

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
