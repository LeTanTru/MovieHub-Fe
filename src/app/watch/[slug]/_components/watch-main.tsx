'use client';

import { ScheduleBadge } from '@/components/app/schedule-badge';
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
        <ScheduleBadge />
        <WatchEpisode />
        <WatchDiscussion />
      </div>
    </div>
  );
}
