'use client';

import { buildAuthPathWithRedirect } from '@/utils';
import { Button } from '@/components/form';
import { queryKeys, ROOM_STATE_ALL, ROOM_TAB_LATEST } from '@/constants';
import { roomApiRequest } from '@/api-requests';
import { RoomCard } from './room-card';
import { RoomListHeader } from './room-list-header';
import { RoomResType, RoomSearchType } from '@/types';
import { route } from '@/routes';
import { useAuth, useIsMounted, useLoadMore, useNavigate } from '@/hooks';
import { useEffect, useState } from 'react';
import { useJoinRoomMutation } from '@/queries';
import { usePathname } from 'next/navigation';
import { VerticalBarLoading } from '@/components/loading';

const ROOM_SKELETON_COUNT = 20;

export function RoomList() {
  const navigate = useNavigate();
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const [activeTab, setActiveTab] = useState<string>(ROOM_TAB_LATEST);
  const [roomState, setRoomState] = useState<number>(ROOM_STATE_ALL);
  const { isAuthenticated, profile } = useAuth();

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

  const { mutate: joinRoom } = useJoinRoomMutation();

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      navigate.push(
        buildAuthPathWithRedirect(route.login.path as string, pathname)
      );
    }
  }, [isAuthenticated, isMounted, navigate, pathname]);

  return (
    <div className='relative mx-auto w-full max-w-475 px-12.5'>
      <RoomListHeader
        loading={isLoading}
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
          : roomList.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isOwner={room.host.id === profile?.id}
                onJoin={joinRoom}
              />
            ))}
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
