'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useStartRoomMutation } from '@/queries';
import { getIdFromSlug, invalidateQueries, notify } from '@/utils';
import { useParams } from 'next/navigation';
import { FaPlay } from 'react-icons/fa6';

export function ButtonStart() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const { mutate: startRoom, isPending } = useStartRoomMutation();

  const handleStartRoom = () => {
    startRoom(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Bắt đầu phòng thành công');
          invalidateQueries([queryKeys.ROOM, id]);
        } else {
          notify.error('Bắt đầu phòng thất bại');
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
          Bắt đầu
        </Button>
      }
    />
  );
}
