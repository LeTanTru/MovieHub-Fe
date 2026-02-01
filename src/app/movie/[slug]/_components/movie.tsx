'use client';

import './movie.css';
import MovieInfo from './movie-info';
import MovieContent from './movie-content';
import {
  useMovieItemListQuery,
  useMoviePersonListQuery,
  useMovieQuery
} from '@/queries';
import { useEffect } from 'react';
import { MovieItemResType, MoviePersonResType, MovieResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { movieItemKinds } from '@/constants';
import MovieSkeleton from './movie-skeleton';

export default function Movie({ id }: { id: string }) {
  const { data: movieData, isLoading: movieLoading } = useMovieQuery({ id });
  const movie: MovieResType | undefined = movieData?.data;

  const { data: movieItemResData } = useMovieItemListQuery({
    params: {
      movieId: id,
      kind: movieItemKinds.MOVIE_ITEM_KIND_SEASON
    },
    enabled: !!movie
  });

  const { data: moviePersonData } = useMoviePersonListQuery({
    params: {
      movieId: id
    },
    enabled: !!movie
  });

  const movieItems: MovieItemResType[] = movieItemResData?.data?.content || [];
  const moviePersons: MoviePersonResType[] =
    moviePersonData?.data?.content || [];

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
          <MovieInfo
            movie={movie}
            movieItems={movieItems}
            moviePersons={moviePersons}
          />
          <MovieContent movie={movie} />
        </div>
      </div>
    </>
  );
}
