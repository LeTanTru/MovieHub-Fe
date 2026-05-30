'use client';

import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonViewComment } from '@/components/app/button-comment';
import { MOVIE_WATCH_DISCUSSION_ID } from '@/constants';
import { ActorList, SuggestionList } from '@/components/app/watch';
import { useMovieInfo, useSlugId } from '@/hooks';
import { useSuggestionMovieListQuery } from '@/queries';

export function WatchSide() {
  const { id: movieId } = useSlugId();

  const { movie, actors } = useMovieInfo();

  const { data: suggestionMovieList = [] } =
    useSuggestionMovieListQuery(movieId);

  if (!movie) return null;

  return (
    <div className='max-1360:w-95 max-1120:border-none max-1120:w-full max-1120:p-7.5 max-990:p-5 max-640:pt-0 flex w-110 shrink-0 flex-col gap-7.5 border-l border-solid border-white/10 p-10'>
      <div className='flex items-center justify-end gap-4'>
        <ButtonViewComment
          className='max-1120:hidden'
          to={MOVIE_WATCH_DISCUSSION_ID}
          variant='watch'
        />
        <ButtonViewReview
          className='max-1120:hidden'
          to={MOVIE_WATCH_DISCUSSION_ID}
          variant='watch'
        />
        <ButtonReview movieId={movie.id} className='' />
      </div>

      <ActorList actors={actors} />
      <SuggestionList movieList={suggestionMovieList} />
    </div>
  );
}
