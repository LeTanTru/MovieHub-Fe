'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonViewComment } from '@/components/app/button-comment';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { MOVIE_DETAIL_DISCUSSION_ID, MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export default function MovieActionBar({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { movie, selectedSeason } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, selectedSeason: s.selectedSeason }))
  );

  if (isLoading)
    return (
      <div className='relative z-3 p-7.5'>
        <div className='flex items-center justify-between gap-8'>
          <Skeleton className='skeleton h-15 w-44 rounded-4xl!' />
          <div className='flex grow justify-start gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton h-15 w-15 rounded-lg!'
              />
            ))}
          </div>
          <Skeleton className='skeleton h-12 w-45 rounded-4xl!' />
        </div>
      </div>
    );

  if (!movie) return null;

  const currentSeasonObj = movie.seasons.find(
    (season) => season.label === selectedSeason
  );
  const latestSeason = movie.seasons[movie.seasons.length - 1];
  const targetSeason = currentSeasonObj || latestSeason;
  const isSeries = movie.type === MOVIE_TYPE_SERIES;
  const latestEpisode = isSeries
    ? targetSeason.episodes[targetSeason.episodes.length - 1]
    : null;

  const watchLink = isSeries
    ? `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}&episode=${latestEpisode?.label}`
    : `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}`;

  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        <ButtonWatchNow
          className='max-640:h-12.5 max-640:min-h-auto max-640:p-2 max-800:min-w-55 max-640:min-w-44'
          href={watchLink}
          variant='detail'
        />
        <div className='max-800:gap-4 flex grow items-center justify-between'>
          <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
            <ButtonLike
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              targetId={movie.id}
              variant='detail'
            />
            <ButtonAddToPlaylist
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              movieId={movie.id}
              variant='detail'
            />
            <ButtonShareMovie
              className='max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              variant='detail'
            />
            <ButtonViewComment
              className='max-520:hidden max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              to={MOVIE_DETAIL_DISCUSSION_ID}
              variant='detail'
            />
            <ButtonViewReview
              className='max-520:hidden max-860:min-w-15 max-640:text-[13px] max-520:text-xs'
              to={MOVIE_DETAIL_DISCUSSION_ID}
              variant='detail'
            />
          </div>
          <ButtonReview
            movieId={movie.id}
            className='max-640:[&_.rating]:mr-0 max-640:[&_.rating]:font-semibold max-640:[&_.content]:hidden'
          />
        </div>
      </div>
    </div>
  );
}
