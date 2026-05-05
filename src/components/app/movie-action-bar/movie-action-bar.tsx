'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonViewComment } from '@/components/app/button-comment';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { MOVIE_DETAIL_DISCUSSION_ID, MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { Skeleton } from '@/components/ui/skeleton';
import { Video } from 'lucide-react';

export default function MovieActionBar() {
  const { movie, selectedSeason } = useMovieStore(
    useShallow((s) => ({ movie: s.movie, selectedSeason: s.selectedSeason }))
  );

  if (!movie) return null;

  const getWatchLink = () => {
    if (!movie?.seasons?.length) return null;

    const currentSeason = movie.seasons.find(
      (season) => season.label === selectedSeason
    );
    const latestSeason = movie.seasons[movie.seasons.length - 1];

    const targetSeason = currentSeason || latestSeason;

    const isSeries = movie.type === MOVIE_TYPE_SERIES;

    const latestEpisode = isSeries
      ? targetSeason?.episodes?.[(targetSeason?.episodes?.length ?? 1) - 1]
      : null;

    const watchLink = isSeries
      ? `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}&episode=${latestEpisode?.label}`
      : `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}`;

    return watchLink;
  };

  const watchLink = getWatchLink();

  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        {watchLink ? (
          <ButtonWatchNow
            className='max-640:h-12.5 max-640:min-h-auto max-640:p-2 max-800:min-w-55 max-640:min-w-44'
            href={watchLink}
            variant='detail'
          />
        ) : (
          <div
            role='button'
            className='flex cursor-pointer flex-col items-center overflow-hidden rounded-lg bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] text-black shadow-[0_0_10px_0_rgba(0,0,0,0.1)] transition-all duration-200 ease-linear hover:opacity-90 hover:shadow-[0_0_10px_10px_rgba(255,218,125,0.15)]'
          >
            <div className='flex items-center justify-center gap-2 px-4 py-2'>
              <Video className='fill-black' />
              <span>Xem Trailer</span>
            </div>
            <div className='w-full bg-white py-1.5 text-center text-xs'>
              Phim sắp ra mắt
            </div>
          </div>
        )}
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

MovieActionBar.Skeleton = function () {
  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        <Skeleton className='skeleton max-640:h-12.5 max-800:min-w-55 max-640:min-w-44 h-15 w-44 rounded-4xl!' />
        <div className='max-800:gap-4 flex grow items-center justify-between'>
          <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton max-520:hidden:max-860:min-w-15 max-640:text-[13px] max-520:text-xs h-15 w-15 rounded-lg!'
              />
            ))}
          </div>
          <Skeleton className='skeleton max-640:min-w-32 h-12 w-45 rounded-4xl!' />
        </div>
      </div>
    </div>
  );
};
