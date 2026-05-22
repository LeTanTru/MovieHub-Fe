import { WatchPlayerProvider } from '@/app/watch/[slug]/_context';
import './watch-player.css';

import {
  WatchPlayerControls,
  WatchPlayerHeader,
  WatchPlayerVideoArea
} from '@/components/app/watch';

export function WatchPlayer() {
  return (
    <WatchPlayerProvider>
      <div className='watch-player max-800:max-w-none max-800:w-full max-800:px-0 max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410 px-5'>
        <WatchPlayerHeader />
        <div className='watch-player-container'>
          <WatchPlayerVideoArea />
          <WatchPlayerControls />
        </div>
      </div>
    </WatchPlayerProvider>
  );
}
