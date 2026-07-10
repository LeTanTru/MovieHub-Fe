'use client';

import { useInView } from 'react-intersection-observer';

import { MovieList } from './movie-list';
import { useAuth } from '@/hooks';
import { useMovieSuggestByWatchedQuery } from '@/queries';
import { VerticalBarLoading } from '@/components/loading';

export function SuggestByWatched({ page }: { page: number }) {
  const { isAuthenticated } = useAuth();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 400px 0px',
    triggerOnce: true
  });

  const { data: movieListData, isLoading } = useMovieSuggestByWatchedQuery({
    params: {
      page
    },
    enabled: isAuthenticated && inView
  });

  const watchedMovie = movieListData?.watchedMovie;
  const movieList = movieListData?.suggestedMovies || [];

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} className='min-h-px'>
      {isLoading ? (
        <VerticalBarLoading />
      ) : watchedMovie ? (
        <MovieList
          loading={isLoading}
          movieList={movieList}
          title={`Vì bạn đã xem ${watchedMovie.title}`}
        />
      ) : null}
    </div>
  );
}
