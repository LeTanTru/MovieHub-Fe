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

  if (!isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading />;

  if (movieList.length === 0) return null;

  return <MovieList movieList={movieList} />;
}
