import { Chat } from './chat';
import { Player } from './player';

export function Room() {
  return (
    <div className='relative flex w-full items-start justify-between overflow-auto bg-black'>
      <Player />
      <Chat />
    </div>
  );
}
