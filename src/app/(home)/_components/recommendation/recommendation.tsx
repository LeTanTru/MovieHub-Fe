'use client';

import { VerticalBarLoading } from '@/components/loading';
import MovieList from './movie-list';
import { useAuth } from '@/hooks';
import { useMovieRecommendationQuery } from '@/queries';

export default function Recommendation() {
  const { isAuthenticated } = useAuth();

  const { data: recommendationData, isLoading } = useMovieRecommendationQuery({
    enabled: isAuthenticated
  });

  const movieList = recommendationData?.data || [];

  if (movieList.length === 0 || !isAuthenticated) return null;

  if (isLoading) return <VerticalBarLoading />;

  return <MovieList movieList={movieList} />;
}
