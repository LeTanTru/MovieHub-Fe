import { RoomList } from './room-list';
import { RoomManager } from './room-manager';

export function Room() {
  return (
    <div className='flex flex-col gap-16'>
      <RoomManager />
      <RoomList />
    </div>
  );
}
