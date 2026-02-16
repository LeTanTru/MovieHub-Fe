'use client';

import WatchEpisode from './watch-episode';
import WatchInfo from './watch-info';
import WatchDiscussion from './watch-discussion';

export default function WatchMain() {
  return (
    <div className='flex grow flex-col gap-10 p-10'>
      <WatchInfo />
      <div>
        <WatchEpisode />
        <WatchDiscussion />
      </div>
    </div>
  );
}
