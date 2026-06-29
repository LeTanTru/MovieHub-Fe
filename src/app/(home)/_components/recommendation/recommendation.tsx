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

  if (!isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading />;

  if (movieList.length === 0) return null;

  return <MovieList movieList={movieList} />;
}
