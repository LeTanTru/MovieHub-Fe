'use client';

import { AppConstants } from '@/constants';
import { useMovieBySlugQuery } from '@/queries';
import './movie-detail.css';
import { Container } from '@/components/layout';
import MovieDetailSidebar from '@/app/movie/[slug]/_components/movie-detail-sidebar';
import MovieDetailContent from '@/app/movie/[slug]/_components/movie-detail-content';

export default function MovieDetail({ slug }: { slug: string }) {
  const res = useMovieBySlugQuery(slug);
  const movie = res.data?.data;
  if (!movie) return null;
  return (
    <>
      <h1 style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {`${movie.title} - ${movie.originalTitle}`}
      </h1>
      <div
        className={
          'bg-background before:content[""] after:from-background/100 after:to-background/0 dotted-bg relative z-1 h-200 w-full overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-1 before:bg-repeat before:opacity-20 after:absolute after:right-0 after:bottom-0 after:left-0 after:z-3 after:h-20 after:bg-linear-to-t after:content-[""] max-[1919px]:h-0 max-[1919px]:pb-[50%] max-[1120px]:pb-120 max-[1120px]:opacity-70 max-[800px]:pb-75 max-[480px]:pb-50'
        }
      >
        <div
          className='webkit-filter absolute top-0 right-0 bottom-0 left-0 h-full w-full bg-cover bg-[50%] opacity-20'
          style={{
            backgroundImage: `url(${AppConstants.contentRootUrl}${movie.posterUrl})`
          }}
        ></div>
        <div className='cover-fade'>
          <div
            className='cover-image'
            style={{
              backgroundImage: `url(${AppConstants.contentRootUrl}${movie.posterUrl})`
            }}
          />
        </div>
      </div>
      <Container className='relative z-9 min-h-[calc(100vh_-_400px)] pt-0 pb-40'>
        <div className='relative z-[3] mx-auto mb-0 flex w-full max-w-[1640px] items-stretch justify-between px-5 py-0'>
          <MovieDetailSidebar movie={movie} />
          <MovieDetailContent movie={movie} />
        </div>
      </Container>
    </>
  );
}
