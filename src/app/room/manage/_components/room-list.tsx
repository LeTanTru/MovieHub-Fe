'use client';

import { roomApiRequest } from '@/api-requests';
import { RoomCard, RoomCreateButton } from '@/app/room/_components';
import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import { NoData } from '@/components/no-data';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/constants';
import { useAuth, useLoadMore, useNavigate } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useDeleteRoomMutation } from '@/queries';
import { RoomResType, RoomSearchType } from '@/types';
import { invalidateQueries, notify } from '@/utils';
import { ChevronLeft, PlusCircle } from 'lucide-react';

const ROOM_SKELETON_COUNT = 10;

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
    queryKey: queryKeys.MY_ROOM_LIST
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
          {!isAuthenticated || isLoading ? (
            <Skeleton className='skeleton h-6 w-10' />
          ) : (
            `(${totalElements})`
          )}
        </h3>
        <RoomCreateButton className='h-8 bg-white px-3! text-black hover:text-black hover:opacity-80' />
      </div>
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
                  className={cn(
                    'group flex items-center justify-center gap-2 rounded-4xl border border-white font-medium text-white backdrop-blur-[10px] hover:border-white/80 hover:text-white/80',
                    'h-8 bg-white px-3! text-black hover:text-black hover:opacity-80'
                  )}
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
              isOwner
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
