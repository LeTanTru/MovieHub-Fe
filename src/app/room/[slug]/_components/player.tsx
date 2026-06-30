import { PlayerFooter } from './player-footer';
import { PlayerHeader } from './player-header';
import { PlayerMain } from './player-main';

export function Player() {
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
