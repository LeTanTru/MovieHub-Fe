'use client';

import { getIdFromSlug } from '@/utils';
import { MOVIE_TAB_SUGGESTION } from '@/constants';
import { MovieGrid, MovieGridSkeleton } from '@/components/app/movie-grid';
import { useParams } from 'next/navigation';
import { useSuggestionMovieListQuery } from '@/queries';
import MotionWrapper from './motion-wrapper';

export default function MovieTabSuggestion({
  direction
}: {
  direction: number;
}) {
  const { slug } = useParams<{ slug: string }>();
  const movieId = getIdFromSlug(slug);

  const {
    data: suggestionMovieListData,
    isLoading: suggestionMovieListLoading
  } = useSuggestionMovieListQuery(movieId);

  const suggestionMovieList = suggestionMovieListData?.data || [];

  return (
    <MotionWrapper uniqueKey={MOVIE_TAB_SUGGESTION} direction={direction}>
      <h3 className='max-1120:mb-4 max-800:text-xl max-640:text-lg max-640:mb-3 max-520:text-base mb-6 text-2xl font-semibold'>
        {suggestionMovieList.length === 0 ? 'Đề xuất' : 'Có thể bạn sẽ thích'}
      </h3>
      {suggestionMovieListLoading ? (
        <MovieGridSkeleton className='max-1600:grid-cols-5 max-1360:gap-5 max-1280:grid-cols-4 max-1280:gap-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-640:gap-3 max-520:grid-cols-2 grid grid-cols-6 gap-6' />
      ) : suggestionMovieList.length === 0 ? (
        <p className='text-gray-400'>Danh sách đề xuất trống</p>
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
