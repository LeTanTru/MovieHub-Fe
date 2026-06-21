import { WatchPlayerProvider } from '@/app/watch/[slug]/_context';
import './watch-player.css';
import { Skeleton } from '@/components/ui/skeleton';

import {
  WatchPlayerControls,
  WatchPlayerHeader,
  WatchPlayerVideoArea
} from '@/components/app/watch';

export function WatchPlayer() {
  return (
    <WatchPlayerProvider>
      <div className='watch-player max-800:max-w-none max-800:w-full max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410'>
        <WatchPlayerHeader />
        <div className='watch-player-container'>
          <WatchPlayerVideoArea />
          <WatchPlayerControls />
        </div>
      </div>
    </WatchPlayerProvider>
  );
}

WatchPlayer.Skeleton = function () {
  return (
    <div className='watch-player max-800:max-w-none max-800:w-full max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410'>
      <div className='max-640:mt-4 max-640:mb-2 max-640:gap-2 max-640:gap-2 max-640:px-2 mb-4 inline-flex w-full items-center gap-4 px-4'>
        <Skeleton className='skeleton size-9 rounded-full' />
        <Skeleton className='skeleton h-7 w-100' />
      </div>
      <div className='watch-player-container'>
        <div className='max-800:rounded-none relative aspect-video w-full overflow-hidden rounded-tl-[6px] rounded-tr-[6px] bg-black'>
          <Skeleton className='skeleton absolute inset-0 h-full w-full rounded-none!' />
        </div>
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
      </div>
    </div>
  );
};
