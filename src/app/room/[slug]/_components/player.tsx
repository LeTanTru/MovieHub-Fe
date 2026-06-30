import { PlayerFooter } from './player-footer';
import { PlayerHeader } from './player-header';
import { PlayerMain } from './player-main';
import { useRoomStore } from '@/store';

export function Player() {
  const room = useRoomStore((state) => state.room);

  if (!room) return <Player.Skeleton />;

  return (
    <div className='flex shrink-0 flex-col'>
      <PlayerHeader />
      <PlayerMain />
      <PlayerFooter />
    </div>
  );
}

Player.Skeleton = function PlayerSkeleton() {
  return (
    <div className='flex shrink-0 flex-col'>
      <PlayerHeader.Skeleton />
      <PlayerMain.Skeleton />
      <PlayerFooter.Skeleton />
    </div>
  );
};
