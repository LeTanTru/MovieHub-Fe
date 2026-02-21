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
      <h3 className='mb-8 text-lg font-semibold'>
        {suggestionMovieList.length === 0 ? 'Đề xuất' : 'Có thể bạn sẽ thích'}
      </h3>
      {suggestionMovieListLoading ? (
        <MovieGridSkeleton className='grid-cols-6' />
      ) : suggestionMovieList.length === 0 ? (
        <p className='text-gray-400'>Danh sách đề xuất trống</p>
      ) : (
        <MovieGrid
          key={MOVIE_TAB_SUGGESTION}
          movieList={suggestionMovieList}
          className='grid-cols-6'
        />
      )}
    </MotionWrapper>
  );
}
