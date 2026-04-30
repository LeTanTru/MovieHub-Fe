'use client';

import { movieApiRequest } from '@/api-requests';
import { useAuth } from '@/hooks';
import { useMovieListWatchedQuery } from '@/queries';
import { useQueries } from '@tanstack/react-query';
import MovieList from './movie-list';

export default function SuggestByWatched() {
  const { isAuthenticated } = useAuth();

  const { data: watchedMovieListData, isLoading: watchedMovieListLoading } =
    useMovieListWatchedQuery({
      enabled: isAuthenticated
    });

  const watchedLength = watchedMovieListData?.data?.length || 0;

  const pageQueries = useQueries({
    queries: Array.from({ length: watchedLength }, (_, i) => ({
      queryKey: ['suggestByWatched', i],
      queryFn: () => movieApiRequest.getSuggestByWatched({ page: i }),
      enabled: isAuthenticated
    }))
  });

  return (
    <div className='flex flex-col gap-10'>
      {pageQueries.map((query, index) => {
        const referenceMovie = query.data?.data?.referenceMovie;
        const movieList = query.data?.data?.suggestedMovies ?? [];

        return (
          <MovieList
            key={index}
            title={`Vì bạn đã xem phim ${referenceMovie?.title} nên bạn có thể thích`}
            loading={watchedMovieListLoading || query.isLoading}
            movieList={movieList}
          />
        );
      })}
    </div>
  );
}
