import { PlayerFooter } from './player-footer';
import { PlayerHeader } from './player-header';
import { PlayerMain } from './player-main';

export function Player() {
  return (
    <div className='h-page-height flex shrink-0 flex-col justify-between'>
      <PlayerHeader />
      <PlayerMain />
      <PlayerFooter />
    </div>
  );
}
