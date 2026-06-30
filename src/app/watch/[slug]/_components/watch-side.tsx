'use client';

import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonViewComment } from '@/components/app/button-comment';
import { MOVIE_WATCH_DISCUSSION_ID } from '@/constants';
import { ActorList, SuggestionList } from '@/components/app/watch';
import { useMovieInfo, useSlugId } from '@/hooks';
import { useSuggestionMovieListQuery } from '@/queries';
import { Skeleton } from '@/components/ui/skeleton';

export function WatchSide() {
  const { id: movieId } = useSlugId();

  const { movie, actors } = useMovieInfo();

  const { data: suggestionMovieList = [] } =
    useSuggestionMovieListQuery(movieId);

  if (!movie) return <WatchSide.Skeleton />;

  return (
    <div className='max-1360:w-95 max-1120:border-none max-1120:w-full max-640:p-2 flex w-110 shrink-0 flex-col border-l border-solid border-white/10 p-4'>
      <div className='max-640:pb-2 flex items-center justify-end gap-4 pb-4'>
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

WatchSide.Skeleton = function WatchSideSkeleton() {
  return (
    <div className='max-1360:w-95 max-1120:border-none max-1120:w-ful max-640:p-2l flex w-110 shrink-0 flex-col border-l border-solid border-white/10 p-4'>
      <div className='max-640:pb-2 flex items-center justify-end gap-4 pb-4'>
        <Skeleton className='skeleton max-1120:hidden h-15 w-20' />
        <Skeleton className='skeleton max-1120:hidden h-15 w-20' />
        <Skeleton className='skeleton h-9 w-16.5' />
      </div>

      <ActorList.Skeleton />
      <SuggestionList.Skeleton />
    </div>
  );
};
