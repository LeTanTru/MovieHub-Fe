'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonLikeDetail } from '@/components/app/button-like';
import { ButtonReview, ButtonViewReview } from '@/components/app/button-review';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonViewComment } from '@/components/app/button-comment';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { MOVIE_TYPE_SERIES } from '@/constants';
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
    (season) => season.ordering + 1 === selectedSeason
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
    <div className='relative z-3 p-7.5'>
      <div className='flex items-center justify-between gap-8'>
        <ButtonWatchNow href={watchLink} variant='detail' />
        {/* Left */}
        <div className='flex grow justify-start gap-4'>
          <ButtonLikeDetail targetId={movie.id} />
          <ButtonAddToPlaylist movieId={movie.id} variant='detail' />
          <ButtonShareMovie variant='detail' />
          <ButtonViewComment to='discussion-detail' />
          <ButtonViewReview to='discussion-detail' />
        </div>
        {/* Right */}
        <ButtonReview movieId={movie.id} />
      </div>
    </div>
  );
}
