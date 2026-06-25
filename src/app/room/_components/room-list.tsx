'use client';

import { RoomCard } from '@/app/room/_components/room-card';
import { RoomListHeader } from './room-list-header';
import { queryKeys, ROOM_STATE_ALL, ROOM_TAB_LATEST } from '@/constants';
import { useState } from 'react';
import { useAuth, useLoadMore } from '@/hooks';
import { RoomResType, RoomSearchType } from '@/types';
import { roomApiRequest } from '@/api-requests';
import { VerticalBarLoading } from '@/components/loading';
import { Button } from '@/components/form';

const ROOM_SKELETON_COUNT = 20;

export function RoomList() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(ROOM_TAB_LATEST);
  const [roomState, setRoomState] = useState<number>(ROOM_STATE_ALL);

  const {
    data: roomList = [],
    isLoading,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    totalElements,
    remainingElements
  } = useLoadMore<HTMLDivElement, RoomSearchType, RoomResType>({
    enabled: isAuthenticated,
    params: { state: roomState !== ROOM_STATE_ALL ? roomState : undefined },
    queryFn: roomApiRequest.getList,
    queryKey: queryKeys.ROOM_LIST
  });

  return (
    <div className='relative mx-auto w-full max-w-475 px-12.5'>
      <RoomListHeader
        activeTab={activeTab}
        roomState={roomState}
        setActiveTab={setActiveTab}
        setRoomState={setRoomState}
        totalRoom={totalElements}
      />
      <div className='grid grid-cols-5 gap-x-5 gap-y-8'>
        {isLoading
          ? Array.from({ length: ROOM_SKELETON_COUNT }).map((_, index) => (
              <RoomCard.Skeleton key={index} />
            ))
          : roomList.map((room) => <RoomCard key={room.id} room={room} />)}
      </div>
      {hasMore && (
        <div className='flex justify-center pt-10'>
          {isLoadingMore ? (
            <VerticalBarLoading />
          ) : (
            <Button
              className='hover:text-golden-glow hover:border-golden-glow border border-solid border-white hover:bg-transparent'
              variant='ghost'
              onClick={handleLoadMore}
            >
              {remainingElements > 0 && `Xem thêm (${remainingElements}) phòng`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
