'use client';

import {
  WatchDiscussion,
  WatchEpisode,
  WatchInfo
} from '@/components/app/watch';

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
