import { Discussion } from '@/components/app/discussion';
import { ScheduleBadge } from '@/components/app/schedule-badge';
import { WatchEpisode, WatchInfo } from '@/components/app/watch';
import { MOVIE_WATCH_DISCUSSION_ID } from '@/constants';

export function WatchMain() {
  return (
    <div className='max-640:p-2 w-full p-4'>
      <WatchInfo />
      <ScheduleBadge />
      <WatchEpisode />
      <Discussion
        toId={MOVIE_WATCH_DISCUSSION_ID}
        className='max-1120:pb-0 px-0'
        variant='watch'
      />
    </div>
  );
}

WatchMain.Skeleton = function () {
  return (
    <div className='max-640:p-2 w-full p-4'>
      <WatchInfo.Skeleton />
      <div>
        <WatchEpisode.Skeleton />
        <Discussion.Skeleton className='max-1120:pb-0 px-0' />
      </div>
    </div>
  );
};
