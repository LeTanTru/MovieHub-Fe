'use client';

import { Discussion } from '@/components/app/discussion';
import { ScheduleBadge } from '@/components/app/schedule-badge';
import { WatchEpisode, WatchInfo } from '@/components/app/watch';
import { MOVIE_WATCH_DISCUSSION_ID } from '@/constants';

export default function WatchMain() {
  return (
    <div className='flex grow flex-col gap-10 p-10'>
      <WatchInfo />
      <div>
        {/* <ScheduleBadge /> */}
        <WatchEpisode />
        <Discussion toId={MOVIE_WATCH_DISCUSSION_ID} className='px-0 pt-5' />
      </div>
    </div>
  );
}
