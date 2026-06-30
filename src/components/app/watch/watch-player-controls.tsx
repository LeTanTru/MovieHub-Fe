'use client';

import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { ButtonAutoNextEpisode } from './button-auto-next-episode';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonMovieTheater } from './button-movie-theater';
import { ButtonReport } from './button-report';
import { ButtonRoom } from './button-room';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonSkipIntro } from './button-skip-intro';
import { useWatchPlayer } from '@/app/watch/[slug]/_context';
import { Skeleton } from '@/components/ui/skeleton';

export function WatchPlayerControls() {
  const {
    movie,
    autoNextEpisode,
    skipIntro,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro
  } = useWatchPlayer();

  if (!movie) return <WatchPlayerControls.Skeleton />;

  return (
    <div className='player-controls bg-covert-black max-990:h-13.5 max-800:rounded-none flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
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
        <ButtonAutoNextEpisode
          autoNextEpisode={autoNextEpisode}
          onClick={handleToggleAutoNextEpisode}
          className='max-990:hidden'
        />
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
        <ButtonRoom className='max-640:px-2! max-520:px-4!' />
        <div className='grow'></div>
        <ButtonReport className='max-640:px-2! max-520:px-4!' />
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
