'use client';

import WatchSide from './watch-side';
import WatchMain from './watch-main';

export default function WatchContainer() {
  return (
    <div className='relative z-2 mx-auto flex w-full max-w-410 items-stretch justify-between px-5'>
      <WatchMain />
      <WatchSide />
    </div>
  );
}
