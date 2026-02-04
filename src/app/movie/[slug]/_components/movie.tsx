'use client';

import './movie.css';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useEffect, useMemo } from 'react';
import { MoviePersonResType, MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { useMovieStore } from '@/store';
import MovieContent from './movie-content';
import MovieInfo from './movie-info';
import MovieSkeleton from './movie-skeleton';
import { useShallow } from 'zustand/shallow';

export default function Movie({ id }: { id: string }) {
  const { setMovie, setMoviePersons } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePersons: s.setMoviePersons
    }))
  );
  const { data: movieData, isLoading: movieLoading } = useMovieQuery({ id });
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

  if (movieLoading || !movie) return <MovieSkeleton />;

  return (
    <>
      <h1 style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {`${movie.title} - ${movie.originalTitle}`}
      </h1>
      <div className='movie-detail'>
        <div
          className='movie-detail-background'
          style={{
            backgroundImage: `url(${renderImageUrl(movie.thumbnailUrl)})`
          }}
        ></div>
        <div className='cover-fade'>
          <div
            className='cover-image'
            style={{
              backgroundImage: `url(${renderImageUrl(movie.thumbnailUrl)})`
            }}
          />
        </div>
      </div>
      <div className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <div className='relative z-3 mx-auto -mt-50 mb-0 flex w-full max-w-410 items-stretch justify-between px-5 py-0'>
          <MovieInfo />
          <MovieContent />
        </div>
      </div>
    </>
  );
}
