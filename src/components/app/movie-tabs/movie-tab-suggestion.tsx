'use client';

import { MOVIE_TAB_SUGGESTION } from '@/constants';
import { MovieGrid } from '@/components/app/movie-grid';
import { useSlugId } from '@/hooks';
import { useSuggestionMovieListQuery } from '@/queries';
import { MotionWrapper } from './motion-wrapper';
import { MovieTabHeading } from '@/components/app/heading';

type MovieTabSuggestionProps = {
  direction: number;
};

export function MovieTabSuggestion({ direction }: MovieTabSuggestionProps) {
  const { id: movieId } = useSlugId();

  const { data: suggestionMovieList = [], isLoading } =
    useSuggestionMovieListQuery(movieId);

  return (
    <MotionWrapper uniqueKey={MOVIE_TAB_SUGGESTION} direction={direction}>
      <MovieTabHeading
        title={
          suggestionMovieList.length === 0 ? 'Đề xuất' : 'Có thể bạn sẽ thích'
        }
      />
      {isLoading ? (
        <MovieGrid.Skeleton className='max-1600:grid-cols-5 max-1360:gap-5 max-1280:grid-cols-4 max-1280:gap-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-3 max-520:grid-cols-2 grid grid-cols-6 gap-6' />
      ) : suggestionMovieList.length === 0 ? (
        <p className='text-accent-foreground'>Danh sách đề xuất trống</p>
      ) : (
        <MovieGrid
          key={MOVIE_TAB_SUGGESTION}
          movieList={suggestionMovieList}
          className='max-1600:grid-cols-5 max-1360:gap-5 max-1280:grid-cols-4 max-1280:gap-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-3 max-520:grid-cols-2 grid grid-cols-6 gap-6'
        />
      )}
    </MotionWrapper>
  );
}
