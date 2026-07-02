import { MovieInfo } from './movie-info';
import { Player } from './player';

import { useChatStore, useRoomStore } from '@/store';
import { cn } from '@/lib';

export function Watch() {
  const room = useRoomStore((state) => state.room);
  const toggleChat = useChatStore((state) => state.toggleChat);

  if (!room) return <Watch.Skeleton />;

  return (
    <div
      className={cn(
        'scrollbar-none flex h-full shrink-0 flex-col overflow-auto transition-all duration-200 ease-linear',
        {
          'w-full': toggleChat,
          'max-1680:w-[calc(100%-380px)] max-1200:w-[calc(100%-320px)] max-800:relative max-800:shrink-0 max-800:w-full max-800:h-auto w-[calc(100%-440px)]':
            !toggleChat
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
    <div className='scrollbar-none max-1680:w-[calc(100%-380px)] max-1200:w-[calc(100%-320px)] max-800:relative max-800:shrink-0 max-800:w-full max-800:h-auto flex h-full w-[calc(100%-440px)] shrink-0 flex-col overflow-auto'>
      <Player.Skeleton />
      <MovieInfo.Skeleton />
    </div>
  );
};
