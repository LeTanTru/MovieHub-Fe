import { MovieInfo } from './movie-info';
import { Player } from './player';

import { useChatStore } from '@/store';
import { cn } from '@/lib';

export function Watch() {
  const toggleChat = useChatStore((state) => state.toggleChat);

  return (
    <div
      className={cn(
        'scrollbar-none flex h-full shrink-0 flex-col overflow-auto transition-all duration-200 ease-linear',
        {
          'w-full': toggleChat,
          'w-[calc(100%-400px)]': !toggleChat
        }
      )}
    >
      <Player />
      <MovieInfo />
    </div>
  );
}

Watch.Skeleton = function WatchSkeleton() {
  return (
    <div className='scrollbar-none flex h-full w-[calc(100%-400px)] shrink-0 flex-col overflow-auto'>
      <Player.Skeleton />
      <MovieInfo.Skeleton />
    </div>
  );
};
