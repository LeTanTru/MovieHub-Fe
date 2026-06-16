'use client';

import './movie.css';
import { Container } from '@/components/layout';
import { MovieMain } from '@/components/app/movie-main';
import { MovieSide } from '@/components/app/movie-side';
import { renderImageUrl } from '@/utils';
import { useEffect } from 'react';
import { useMoviePersonListQuery, useMovieQuery } from '@/queries';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { Discussion } from '@/components/app/discussion';
import { MovieActionBar } from '@/components/app/movie-action-bar';
import { MovieTabs } from '@/components/app/movie-tabs';
import { NotFound } from './not-found';
import { Skeleton } from '@/components/ui/skeleton';
import { MAX_PAGE_SIZE } from '@/constants';

type MovieProps = {
  id: string;
};

export function Movie({ id }: MovieProps) {
  const { setMovie, setMoviePerson } = useMovieStore(
    useShallow((s) => ({
      setMovie: s.setMovie,
      setMoviePerson: s.setMoviePerson
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

  useEffect(() => {
    if (movie) setMovie(movie);
  }, [movie, setMovie]);

  useEffect(() => {
    setMoviePerson(moviePerson);
  }, [moviePerson, setMoviePerson]);

  if (isLoading) return <Movie.Skeleton />;

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

Movie.Skeleton = function () {
  return (
    <>
      <div className='movie-detail'>
        <Skeleton className='skeleton h-full w-full' />
      </div>
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <div className='max-1900:-mt-25 max-1120:flex-col max-1120:-mt-37.5 max-640:-mt-30 max-640:px-4 max-640:py-0 max-1120:flex-col relative z-3 mx-auto -mt-50 flex w-full max-w-410 items-stretch justify-between px-5'>
          <MovieSide.Skeleton />
          <div className='bg-main-background/60 max-1120:bg-transparent max-1120:rounded-none max-1120:backdrop-blur-none flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
            <MovieActionBar.Skeleton />
            <MovieTabs.Skeleton />
            <Discussion.Skeleton />
          </div>
        </div>
      </Container>
    </>
  );
};
