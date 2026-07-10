import { WatchPlayerProvider } from '@/contexts';
import './watch-player.css';

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

WatchPlayer.Skeleton = function WatchPlayerSkeleton() {
  return (
    <div className='watch-player max-800:max-w-none max-800:w-full max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410'>
      <WatchPlayerHeader.Skeleton />
      <div className='watch-player-container'>
        <WatchPlayerVideoArea.Skeleton />
        <WatchPlayerControls.Skeleton />
      </div>
    </div>
  );
};
