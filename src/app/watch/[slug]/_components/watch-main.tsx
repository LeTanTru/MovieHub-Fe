import { Discussion } from '@/components/app/discussion';
import { ScheduleBadge } from '@/components/app/schedule-badge';
import { WatchEpisode, WatchInfo } from '@/components/app/watch';
import { MOVIE_WATCH_DISCUSSION_ID } from '@/constants';

export default function WatchMain() {
  return (
    <div className='max-990:p-5 max-640:px-4 flex grow flex-col gap-10 p-7.5'>
      <WatchInfo />
      <div>
        <ScheduleBadge />
        <WatchEpisode />
        <Discussion
          toId={MOVIE_WATCH_DISCUSSION_ID}
          className='max-1120:pb-0 px-0'
          variant='watch'
        />
      </div>
    </div>
  );
}
