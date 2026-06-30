'use client';

import { invalidateQueries, notify } from '@/utils';
import { Button } from '@/components/form';
import { queryKeys, ROOM_STATE_ALL } from '@/constants';
import { roomApiRequest } from '@/api-requests';
import { RoomCard } from './room-card';
import { RoomListHeader } from './room-list-header';
import { RoomResType, RoomSearchType } from '@/types';
import { useAuth, useLoadMore } from '@/hooks';
import { useState } from 'react';
import { useDeleteRoomMutation } from '@/queries';
import { VerticalBarLoading } from '@/components/loading';
import { logger } from '@/logger';
import { NoData } from '@/components/no-data';
import { PlusCircle } from 'lucide-react';

const ROOM_SKELETON_COUNT = 10;

export function RoomList() {
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

  const { mutate: deleteRoom } = useDeleteRoomMutation();

  const handleDeleteRoom = (id: string) => {
    deleteRoom(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xóa phòng thành công');
          invalidateQueries([queryKeys.ROOM_LIST], [queryKeys.MY_ROOM_LIST]);
        } else {
          notify.error('Xóa phòng thất bại');
        }
      },
      onError: (error) => {
        logger.error('[DELETE_ROOM_ERROR]', error);
        notify.error('Xóa phòng thất bại');
      }
    });
  };

  return (
    <div className='relative mx-auto w-full max-w-475 px-12.5'>
      <RoomListHeader
        loading={isLoading}
        roomState={roomState}
        totalRoom={totalElements}
        setRoomState={setRoomState}
      />
      {!isAuthenticated || isLoading ? (
        <div className='grid grid-cols-5 gap-x-5 gap-y-8'>
          {Array.from({ length: ROOM_SKELETON_COUNT }).map((_, index) => (
            <RoomCard.Skeleton key={index} />
          ))}
        </div>
      ) : roomList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 w-full pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa tạo phòng nào.
              <div className='flex items-center justify-center'>
                Hãy nhấn vào nút&nbsp;
                <Button
                  className='group flex items-center justify-center gap-2 rounded-4xl border border-white font-medium text-white backdrop-blur-[10px] hover:border-white/80 hover:text-white/80'
                  variant='outline'
                >
                  <PlusCircle className='max-640:size-4 size-4.5 fill-white text-black group-hover:opacity-80' />
                  Tạo mới
                </Button>
                &nbsp; để xem hướng dẫn tạo phòng xem chung nhé 😊
              </div>
            </>
          }
        />
      ) : (
        <div className='grid grid-cols-5 gap-x-5 gap-y-8'>
          {roomList.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isOwner={room.host.id == profile?.id}
              onDelete={() => handleDeleteRoom(room.id)}
            />
          ))}
        </div>
      )}
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
