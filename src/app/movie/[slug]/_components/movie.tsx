'use client';
import './movie.css';
import { Container } from '@/components/layout';
import { MovieMain } from '@/components/app/movie-main';
import { MovieSide } from '@/components/app/movie-side';
import { renderImageUrl } from '@/utils';
import { useEffect, useMemo } from 'react';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import MovieSkeleton from './movie-skeleton';
import NotFound from './not-found';

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
    if (movie) setMovie(movie);
  }, [movie, setMovie]);

  useEffect(() => {
    if (moviePersons.length > 0) setMoviePersons(moviePersons);
  }, [moviePersons, setMoviePersons]);

  if (movieLoading) return <MovieSkeleton />;

  if (!movie) return <NotFound />;

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
