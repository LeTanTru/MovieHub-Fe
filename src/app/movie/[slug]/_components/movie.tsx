'use client';

import './movie.css';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useEffect, useMemo } from 'react';
import { renderImageUrl } from '@/utils';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieSide } from '@/components/app/movie-side';
import { MovieMain } from '@/components/app/movie-main';
import { Container } from '@/components/layout';

export default function Movie({ id }: { id: string }) {
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

  if (movieLoading || !movie)
    return (
      <div className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <Skeleton className='skeleton h-0 w-full pt-[40%]' />
        <div className='relative z-3 mx-auto -mt-50 mb-0 flex w-full max-w-410 items-stretch justify-between px-5 py-0'>
          <MovieSide isLoading />
          <MovieMain isLoading />
        </div>
      </div>
    );

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
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <div className='max-1900:-mt-25 max-1120:flex-col max-1120:-mt-37.5 max-640:-mt-30 max-640:px-4 max-640:py-0 max-1120:flex-col relative z-3 mx-auto -mt-50 flex w-full max-w-410 items-stretch justify-between px-5'>
          <MovieSide />
          <MovieMain />
        </div>
      </Container>
    </>
  );
}
