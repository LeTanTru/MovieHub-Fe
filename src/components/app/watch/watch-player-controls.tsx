'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonAutoNextEpisode } from './button-auto-next-episode';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonMovieTheater } from './button-movie-theater';
import { ButtonReport } from './button-report';
import { ButtonRoom } from './button-room';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonSkipIntro } from './button-skip-intro';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMovieInfo } from '@/hooks';
import { useWatchPlayer } from '@/contexts';

export function WatchPlayerControls() {
  const {
    movie,
    video,
    autoNextEpisode,
    skipIntro,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro
  } = useWatchPlayer();

  const { hasTrailer, canWatch, episodes, isSingle, isSeries } = useMovieInfo();

  const isHasEpisodes = episodes && episodes.length > 0;

  const hideRoomButton = (isSingle && !video) || (isSeries && !isHasEpisodes);

  if (!movie) return <WatchPlayerControls.Skeleton />;

  return (
    <div className='player-controls bg-covert-black max-990:h-13.5 max-640:h-10 max-800:rounded-none flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
      {!canWatch && (
        <div
          role='button'
          className='group max-640:px-2 relative flex h-full shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-bl-[12px] px-5 text-center text-black hover:shadow-[0_0_24px_6px_rgba(255,207,89,0.3)]'
          style={{
            background:
              'linear-gradient(135deg, #FECF59 0%, #FFE87C 50%, #FFF1CC 100%)',
            boxShadow: '0 4px 14px 0 rgba(254,207,89,0.35)'
          }}
        >
          <div className='pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
          {!hasTrailer && (
            <Calendar className='max-640:size-4 relative size-5 animate-bounce font-semibold' />
          )}
          <span className='max-640:text-[13px] relative font-semibold uppercase transition-transform duration-200 group-hover:scale-105'>
            {!hasTrailer ? 'Sắp ra mắt' : 'Phim sắp ra mắt'}
          </span>
        </div>
      )}
      <div className='max-1280:px-0 max-640:gap-2 max-640:px-2 max-1280:gap-0 max-520:px-4 max-520:gap-4 flex w-full items-center gap-2 px-4 select-none'>
        <ButtonLike
          className='max-640:px-2! max-520:px-4!'
          targetId={movie.id}
          variant='watch'
          text='Yêu thích'
        />
        <ButtonAddToPlaylist
          className='max-640:px-2! max-520:px-4!'
          movieId={movie.id}
          variant='watch'
        />
        {isHasEpisodes && (
          <ButtonAutoNextEpisode
            autoNextEpisode={autoNextEpisode}
            onClick={handleToggleAutoNextEpisode}
            className='max-990:hidden'
          />
        )}
        <ButtonSkipIntro
          handleToggleSkipIntro={handleToggleSkipIntro}
          skipIntro={skipIntro}
          className='max-990:hidden'
        />
        <ButtonMovieTheater className='max-1120:hidden' />
        <div className='backdrop-movie-theater'></div>
        <ButtonShareMovie
          variant='watch'
          className='max-640:px-2! max-520:px-4!'
        />
        {!hideRoomButton && (
          <ButtonRoom className='max-640:px-2! max-520:px-4!' />
        )}
        <div className='grow'></div>
        <ButtonReport
          videoId={video?.id ?? ''}
          className='max-640:px-2! max-520:px-4!'
        />
      </div>
    </div>
  );
}

WatchPlayerControls.Skeleton = function WatchPlayerControlsSkeleton() {
  return (
    <div className='player-controls bg-covert-black max-990:h-13.5 max-800:rounded-none flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
      <div className='max-1280:px-0 max-640:gap-2 max-640:px-2 max-1280:gap-0 max-520:px-4 max-520:gap-4 flex w-full items-center gap-2 px-4'>
        <Skeleton className='skeleton max-640:w-9 max-520:w-13 h-9 w-25' />
        <Skeleton className='skeleton max-640:w-9 max-520:w-13 h-9 w-25' />
        <Skeleton className='skeleton max-990:hidden h-9 w-25' />
        <Skeleton className='skeleton max-990:hidden h-9 w-25' />
        <Skeleton className='skeleton max-1120:hidden h-9 w-25' />
        <Skeleton className='skeleton max-640:w-9 max-520:w-13 h-9 w-25' />
        <Skeleton className='skeleton max-640:w-9 max-520:w-13 h-9 w-25' />
        <div className='grow'></div>
        <Skeleton className='skeleton max-640:w-9 max-520:w-13 h-9 w-25' />
      </div>
    </div>
  );
};
