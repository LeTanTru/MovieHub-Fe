'use client';

import { RoomFilter } from './room-filter';
import { SearchRoomForm } from './search-room-form';
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
    <div className='flex-start max-1120:mb-5 max-990:mb-4 max-640:gap-3 relative mb-6 flex flex-wrap items-center gap-4'>
      <h3 className='max-1600:text-2xl max-640:text-xl max-480:text-base text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        Xem chung&nbsp;
        {loading ? (
          <Skeleton className='max-1600:h-5 max-1600:w-9 max-640:h-4 max-640:w-8 max-480:h-3.5 max-480:w-7 skeleton h-6 w-10' />
        ) : (
          `(${totalRoom})`
        )}
      </h3>
      <SearchRoomForm />
      <RoomFilter roomState={roomState} setRoomState={setRoomState} />
    </div>
  );
}
