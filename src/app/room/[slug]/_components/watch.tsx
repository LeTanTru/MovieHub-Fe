import { MovieInfo } from './movie-info';
import { Player } from './player';

export function Watch() {
  return (
    <div className='scrollbar-none h-page-height flex w-[calc(100%-400px)] shrink-0 flex-col overflow-auto'>
      <Player />
      <MovieInfo />
    </div>
  );
}

Watch.Skeleton = function WatchSkeleton() {
  return (
    <div className='scrollbar-none h-page-height flex w-[calc(100%-400px)] shrink-0 flex-col overflow-auto'>
      <Player.Skeleton />
      <MovieInfo.Skeleton />
    </div>
  );
};
