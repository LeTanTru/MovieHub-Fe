'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { ErrorCode, queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useStartRoomMutation } from '@/queries';
import { useRoomStore } from '@/store';
import { getIdFromSlug, invalidateQueries, notify } from '@/utils';
import { useParams } from 'next/navigation';
import { FaPlay } from 'react-icons/fa6';

export function ButtonStart() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const setIsJoined = useRoomStore((state) => state.setIsJoined);
  const { mutate: startRoom, isPending } = useStartRoomMutation();

  const handleStartRoom = () => {
    startRoom(id, {
      onSuccess: (res) => {
        if (res.result) {
          setIsJoined(true);
          invalidateQueries(
            [queryKeys.ROOM, id],
            [queryKeys.ROOM_LIST],
            [queryKeys.MY_ROOM_LIST]
          );
          notify.success('Bắt đầu phòng thành công');
        } else {
          const errorCode = res.code;
          if (errorCode === ErrorCode.ROOM_ERROR_INVALID_ROOM) {
            notify.error(
              'Bạn đã có một phòng đang diễn ra, vui lòng kết thúc phòng trước khi bắt đầu phòng mới'
            );
          } else {
            notify.error('Bắt đầu phòng thất bại');
          }
        }
      },
      onError: (error) => {
        logger.error('[START_ROOM_ERROR]', error);
        notify.error('Bắt đầu phòng thất bại');
      }
    });
  };

  return (
    <ConfirmModal
      message='Bạn có chắn chắn muốn bắt đầu phòng này không ?'
      onConfirm={handleStartRoom}
      triggerClassName='w-fit'
      trigger={
        <Button
          className='rounded-full'
          loading={isPending}
          disabled={isPending}
          size='sm'
        >
          <FaPlay />
          <span className='max-800:hidden'>Bắt đầu</span>
        </Button>
      }
    />
  );
}
