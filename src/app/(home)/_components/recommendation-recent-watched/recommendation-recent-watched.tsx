'use client';

import { useAuth } from '@/hooks';
import { useMovieRecommendationRecentWatchedCategoryQuery } from '@/queries';
import { VerticalBarLoading } from '@/components/loading';
import { MovieList } from './movie-list';

export function RecommendationRecentWatched() {
  const { isAuthenticated } = useAuth();

  const { data: recentWatchedRecommendations, isLoading } =
    useMovieRecommendationRecentWatchedCategoryQuery({
      enabled: isAuthenticated
    });

  if (!isAuthenticated || !recentWatchedRecommendations) return null;

  if (isLoading) return <VerticalBarLoading />;

  return (
    <div className='max-640:gap-8 flex flex-col gap-12.5'>
      <MovieList
        key={recentWatchedRecommendations.category.id}
        category={recentWatchedRecommendations.category}
        movieList={recentWatchedRecommendations.movies}
        loading={isLoading}
      />
    </div>
  );
}
