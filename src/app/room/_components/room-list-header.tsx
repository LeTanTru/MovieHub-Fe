'use client';

import { RoomFilter } from './room-filter';
import { ButtonAction } from '@/components/app/button-action';
import { Skeleton } from '@/components/ui/skeleton';
import { roomActions } from '@/constants';

type RoomheaderProps = {
  activeTab: string;
  roomState: number;
  totalRoom: number;
  loading: boolean;
  setActiveTab: (tab: string) => void;
  setRoomState: (state: number) => void;
};

export function RoomListHeader({
  activeTab,
  roomState,
  totalRoom,
  loading,
  setActiveTab,
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
      <div className='relative flex shrink-0 items-stretch' role='tablist'>
        {roomActions.map((action) => (
          <ButtonAction
            key={action.key}
            label={action.label}
            action={action.key}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className='max-640:text-[13px] max-520:text-xs'
          />
        ))}
      </div>
      <RoomFilter roomState={roomState} setRoomState={setRoomState} />
    </div>
  );
}
