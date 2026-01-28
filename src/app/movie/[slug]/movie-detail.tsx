'use client';

import './movie-detail.css';
import { Container } from '@/components/layout';
import MovieDetailSidebar from '@/app/movie/[slug]/_components/movie-detail-sidebar';
import MovieDetailContent from '@/app/movie/[slug]/_components/movie-detail-content';
import { useMovieQuery } from '@/queries';
import { useEffect } from 'react';
import { MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';

function MovieDetailSkeleton() {
  return (
    <Container className='relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
      <div className='relative z-3 mx-auto mb-0 flex w-full max-w-410 items-stretch justify-between px-5 py-0'>
        <div className='h-125 w-1/3 animate-pulse rounded-lg bg-gray-700' />
        <div className='ml-4 w-2/3 animate-pulse'>
          <div className='mb-4 h-10 w-1/2 rounded bg-gray-700' />
          <div className='mb-2 h-6 w-3/4 rounded bg-gray-700' />
          <div className='mb-2 h-6 w-2/3 rounded bg-gray-700' />
          <div className='h-6 w-1/2 rounded bg-gray-700' />
        </div>
      </div>
    </Container>
  );
}

export default function MovieDetail({ slug }: { slug: string }) {
  const id = slug.split('.')[1];
  const { data: movieData } = useMovieQuery(id);
  const movie: MovieResType | undefined = movieData?.data;

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

  if (!movie) {
    return <MovieDetailSkeleton />;
  }

  return (
    <>
      <h1 style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {`${movie.title} - ${movie.originalTitle}`}
      </h1>
      <div
        className={
          'bg-background before:content[""] after:from-background after:to-background/0 dotted-bg max-1919:h-0 max-1919:pb-[50%] max-1120:pb-120 max-1120:opacity-70 max-800:pb-75 max-480:pb-50 relative z-1 h-200 w-full overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-1 before:bg-repeat before:opacity-20 after:absolute after:right-0 after:bottom-0 after:left-0 after:z-3 after:h-20 after:bg-linear-to-t after:content-[""]'
        }
      >
        <div
          className='webkit-filter absolute top-0 right-0 bottom-0 left-0 h-full w-full bg-cover bg-position-[50%] opacity-20'
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
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
        <div className='relative z-3 mx-auto mb-0 flex w-full max-w-410 items-stretch justify-between px-5 py-0'>
          <MovieDetailSidebar movie={movie} />
          <MovieDetailContent movie={movie} />
        </div>
      </Container>
    </>
  );
}
