'use client';

import { useInView } from 'react-intersection-observer';

import MovieList from './movie-list';
import { useAuth } from '@/hooks';
import { useMovieSuggestByWatchedQuery } from '@/queries';

export default function SuggestByWatched({ page }: { page: number }) {
  const { isAuthenticated } = useAuth();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px 0px 0px 0px'
  });

  const { data: movieListData, isLoading } = useMovieSuggestByWatchedQuery({
    params: {
      page
    },
    enabled: isAuthenticated && inView
  });

  const watchedMovie = movieListData?.data?.referenceMovie;
  const movieList = movieListData?.data?.suggestedMovies || [];

  return (
    <div ref={ref}>
      <MovieList
        loading={isLoading}
        movieList={movieList}
        title={`Vì bạn đã xem ${watchedMovie?.title}`}
      />
    </div>
  );
}
