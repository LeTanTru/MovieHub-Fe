'use client';

import { RoomFilter } from './room-filter';
import { Skeleton } from '@/components/ui/skeleton';

type RoomheaderProps = {
  loading: boolean;
  roomState: number;
  totalRoom: number;
  setRoomState: (state: number) => void;
};

export function RoomListHeader({
  loading,
  roomState,
  totalRoom,
  setRoomState
}: RoomheaderProps) {
  return (
    <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
      <h3 className='flex items-center text-2xl leading-[1.4] font-bold text-white text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'>
        Xem chung&nbsp;
        {loading ? (
          <Skeleton className='skeleton h-6 w-10' />
        ) : (
          `(${totalRoom})`
        )}
      </h3>
      <RoomFilter roomState={roomState} setRoomState={setRoomState} />
    </div>
  );
}
