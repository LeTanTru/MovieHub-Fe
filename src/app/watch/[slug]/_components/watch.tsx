'use client';

import { useIsomorphicLayoutEffect } from '@/hooks';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { NotFound } from './not-found';
import { WatchContainer } from './watch-container';
import { WatchPlayer } from './watch-player';
import { ErrorCode, MAX_PAGE_SIZE } from '@/constants';

type WatchProps = {
  id: string;
};

export function Watch({ id }: WatchProps) {
  const { setMovie, setMoviePerson } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePerson: s.setMoviePerson
    }))
  );
  const { data: movieData, isLoading } = useMovieQuery(id);

  const movie = movieData?.data;
  const errorCode = movieData?.code;

  const { data: moviePerson = [] } = useMoviePersonListQuery({
    params: {
      movieId: id,
      size: MAX_PAGE_SIZE
    },
    enabled: !!movie
  });

  useIsomorphicLayoutEffect(() => {
    if (movie) setMovie(movie);
  }, [movie, setMovie]);

  useIsomorphicLayoutEffect(() => {
    setMoviePerson(moviePerson);

    return () => {
      setMoviePerson([]);
    };
  }, [moviePerson, setMoviePerson]);

  if (isLoading) return <Watch.Skeleton />;

  if (errorCode === ErrorCode.MOVIE_ERROR_NOT_FOUND || !movie) {
    return <NotFound />;
  }

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

Watch.Skeleton = function WatchSkeleton() {
  return (
    <>
      <WatchPlayer.Skeleton />
      <WatchContainer.Skeleton />
    </>
  );
};
