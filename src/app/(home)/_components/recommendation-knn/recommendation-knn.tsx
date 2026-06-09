'use client';

import { VerticalBarLoading } from '@/components/loading';
import { MovieList } from './movie-list';
import { useAuth } from '@/hooks';
import { useMovieRecommendationKNNQuery } from '@/queries';

export function RecommendationKNN() {
  const { isAuthenticated } = useAuth();

  const { data: movieListData, isLoading } = useMovieRecommendationKNNQuery({
    enabled: isAuthenticated
  });

  const movieList = movieListData?.content || [];

  if (movieList.length === 0 || !isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading />;

  return <MovieList movieList={movieList} />;
}
