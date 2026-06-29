import { WatchSide } from './watch-side';
import { WatchMain } from './watch-main';

export function WatchContainer() {
  return (
    <div className='max-1120:flex-col relative z-2 mx-auto flex w-full max-w-410 items-stretch justify-between'>
      <WatchMain />
      <WatchSide />
    </div>
  );
}

WatchContainer.Skeleton = function WatchContainerSkeleton() {
  return (
    <div className='max-1120:flex-col relative z-2 mx-auto flex w-full max-w-410 items-stretch justify-between'>
      <WatchMain.Skeleton />
      <WatchSide.Skeleton />
    </div>
  );
};
