'use client';

import WatchSide from './watch-side';
import WatchMain from './watch-main';

export default function WatchContainer() {
  return (
    <div className='max-1600:px-0 max-1120:flex-col relative z-2 mx-auto flex w-full max-w-410 items-stretch justify-between px-5'>
      <WatchMain />
      <WatchSide />
    </div>
  );
}
