'use client';

import { useIsomorphicLayoutEffect } from '@/hooks';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { NotFound } from './not-found';
import { WatchContainer } from './watch-container';
import { WatchPlayer } from './watch-player';
import { MAX_PAGE_SIZE } from '@/constants';

type WatchProps = {
  id: string;
};

export function Watch({ id }: WatchProps) {
  const { setMovie, setMoviePerson, reset } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePerson: s.setMoviePerson,
      reset: s.reset
    }))
  );
  const { data: movie, isLoading } = useMovieQuery(id);

  const { data: moviePerson = [] } = useMoviePersonListQuery({
    params: {
      movieId: id,
      size: MAX_PAGE_SIZE
    },
    enabled: !!movie
  });

  useIsomorphicLayoutEffect(() => {
    if (movie) setMovie(movie);

    return () => {
      reset();
    };
  }, [movie, setMovie, reset]);

  useIsomorphicLayoutEffect(() => {
    setMoviePerson(moviePerson);

    return () => {
      setMoviePerson([]);
    };
  }, [moviePerson, setMoviePerson]);

  if (isLoading) return <Watch.Skeleton />;

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

Watch.Skeleton = function () {
  return (
    <>
      <WatchPlayer.Skeleton />
      <WatchContainer.Skeleton />
    </>
  );
};
