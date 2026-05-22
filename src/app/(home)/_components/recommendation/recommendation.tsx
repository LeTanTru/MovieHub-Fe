'use client';

import { VerticalBarLoading } from '@/components/loading';
import { MovieList } from './movie-list';
import { useAuth } from '@/hooks';
import { useMovieRecommendationQuery } from '@/queries';

export function Recommendation() {
  const { isAuthenticated } = useAuth();

  const { data: movieList = [], isLoading } = useMovieRecommendationQuery({
    enabled: isAuthenticated
  });

  if (movieList.length === 0 || !isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading />;

  return <MovieList movieList={movieList} />;
}
