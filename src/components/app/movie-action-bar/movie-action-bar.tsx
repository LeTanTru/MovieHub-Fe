'use client';

import { MessageIcon } from '@/assets';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { Button } from '@/components/form';
import { MOVIE_TYPE_SERIES } from '@/constants';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonLikeDetail } from '@/components/app/button-like';
import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonShareMovie } from '@/components/app/button-share';
import { scroller } from 'react-scroll';
import { useShallow } from 'zustand/shallow';
import { ButtonReview } from '@/components/app/button-review';

export default function MovieActionBar({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  const { movie, selectedSeason } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      selectedSeason: s.selectedSeason
    }))
  );

  if (isLoading)
    return (
      <div className='relative z-3 p-7.5'>
        <div className='flex items-center justify-between gap-8'>
          <Skeleton className='skeleton h-12 w-44 rounded-4xl' />
          <div className='flex grow justify-start gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton h-12 w-20 rounded-lg'
              />
            ))}
          </div>
          <Skeleton className='skeleton h-10 w-28 rounded-4xl' />
        </div>
      </div>
    );

  if (!movie) return null;

  const currentSeasonObj = movie.seasons.find(
    (season) => season.ordering + 1 === selectedSeason
  );
  const latestSeason = movie.seasons[movie.seasons.length - 1];
  const targetSeason = currentSeasonObj || latestSeason;
  const isSeries = movie.type === MOVIE_TYPE_SERIES;
  const latestEpisode = isSeries
    ? targetSeason.episodes[targetSeason.episodes.length - 1]
    : null;

  const watchHref = isSeries
    ? `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}&episode=${latestEpisode?.label}`
    : `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}`;

  return (
    <div className='relative z-3 p-7.5'>
      <div className='flex items-center justify-between gap-8'>
        <ButtonWatchNow
          className='text-watch-now inline-flex min-h-15 shrink-0 items-center justify-center gap-4 rounded-4xl bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] px-8! py-4! text-base font-semibold opacity-100 shadow-[0_5px_10px_5px_rgba(255,218,125,.1)] transition-all duration-200 ease-linear hover:opacity-90 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,.15)]'
          href={watchHref}
        />
        {/* Left */}
        <div className='flex grow justify-start gap-4'>
          <ButtonLikeDetail targetId={movie.id} />
          <ButtonAddToPlaylist movieId={movie.id} />
          <ButtonShareMovie />
          <Button
            className='hover:text-light-golden-yellow! h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
            variant='ghost'
            onClick={() => {
              scroller.scrollTo('discussion', {
                duration: 200,
                delay: 0,
                smooth: true,
                offset: -100
              });
            }}
          >
            <MessageIcon />
            Bình luận
          </Button>
        </div>
        {/* Right */}
        <ButtonReview movieId={movie.id} />
      </div>
    </div>
  );
}
