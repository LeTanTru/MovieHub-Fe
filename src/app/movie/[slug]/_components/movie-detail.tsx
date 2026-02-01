'use client';

import './movie-detail.css';
import MovieDetailSidebar from '@/app/movie/[slug]/_components/movie-detail-sidebar';
import MovieDetailContent from '@/app/movie/[slug]/_components/movie-detail-content';
import {
  useMovieItemListQuery,
  useMoviePersonListQuery,
  useMovieQuery
} from '@/queries';
import { useEffect } from 'react';
import { MovieItemResType, MoviePersonResType, MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';
import MovieDetailSkeleton from '@/app/movie/[slug]/_components/movie-detail-skeleton';
import { movieItemKinds } from '@/constants';

export default function MovieDetail({ id }: { id: string }) {
  const { data: movieData, isLoading: movieLoading } = useMovieQuery({ id });
  const movie: MovieResType | undefined = movieData?.data;

  const { data: movieItemResData, isLoading: movieItemLoading } =
    useMovieItemListQuery({
      params: {
        movieId: id,
        kind: movieItemKinds.MOVIE_ITEM_KIND_SEASON
      },
      enabled: !!movie
    });

  const { data: personResData, isLoading: personLoading } =
    useMoviePersonListQuery({
      params: {
        movieId: id
      },
      enabled: !!movie
    });

  const movieItems: MovieItemResType[] = movieItemResData?.data?.content || [];
  const persons: MoviePersonResType[] = personResData?.data?.content || [];

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

  return (
    <>
      {movieLoading || movieItemLoading || personLoading || !movie ? (
        <MovieDetailSkeleton />
      ) : (
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
              <MovieDetailSidebar
                movie={movie}
                movieItems={movieItems}
                persons={persons}
              />
              <MovieDetailContent movie={movie} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
