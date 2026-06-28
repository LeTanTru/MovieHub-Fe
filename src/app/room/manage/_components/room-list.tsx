'use client';

import { roomApiRequest } from '@/api-requests';
import { RoomCard, RoomCreateButton } from '@/app/room/_components';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/constants';
import { useAuth, useLoadMore, useNavigate } from '@/hooks';
import { useJoinRoomMutation } from '@/queries';
import { RoomResType, RoomSearchType } from '@/types';
import { ChevronLeft } from 'lucide-react';

const ROOM_SKELETON_COUNT = 20;

export function RoomList() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
    params: {},
    queryFn: roomApiRequest.getMyRooms,
    queryKey: queryKeys.ROOM_LIST
  });

  const { mutate: joinRoom } = useJoinRoomMutation();

  return (
    <div className='relative mx-auto w-full max-w-475 px-12.5'>
      <div className='relative mb-4 flex min-h-11 items-center justify-start gap-4'>
        <Button
          variant='ghost'
          className='size-9 rounded-full border border-solid border-white hover:bg-transparent hover:opacity-80'
          onClick={() => navigate.back()}
        >
          <ChevronLeft className='size-6' />
        </Button>
        <h3 className='flex items-center text-2xl leading-[1.4] font-bold text-white text-shadow-[0_2px_1px_rgba(0,0,0,.3)]'>
          Quản lý xem chung&nbsp;
          {isLoading ? (
            <Skeleton className='skeleton h-6 w-10' />
          ) : (
            `(${totalElements})`
          )}
        </h3>
        <RoomCreateButton className='h-8 bg-white px-3! text-black hover:text-black hover:opacity-80' />
      </div>
      <div className='grid grid-cols-5 gap-x-5 gap-y-8'>
        {isLoading
          ? Array.from({ length: ROOM_SKELETON_COUNT }).map((_, index) => (
              <RoomCard.Skeleton key={index} />
            ))
          : roomList.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={joinRoom} />
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
