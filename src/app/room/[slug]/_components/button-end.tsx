'use client';

import { Button } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useEndRoomMutation } from '@/queries';
import { getIdFromSlug, invalidateQueries, notify } from '@/utils';
import { useParams } from 'next/navigation';
import { FaVideoSlash } from 'react-icons/fa6';

export function ButtonEnd() {
  const { slug } = useParams<{ slug: string }>();
  const id = getIdFromSlug(slug);

  const { mutate: endRoom, isPending } = useEndRoomMutation();

  const handleEndRoom = () => {
    endRoom(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Kết thúc phòng thành công');
          invalidateQueries(
            [queryKeys.ROOM, id],
            [queryKeys.ROOM_LIST],
            [queryKeys.MY_ROOM_LIST]
          );
        } else {
          notify.error('Kết thúc phòng thất bại');
        }
      },
      onError: (error) => {
        logger.error('[END_ROOM_ERROR]', error);
        notify.error('Kết thúc phòng thất bại');
      }
    });
  };

  return (
    <ConfirmModal
      message='Bạn có chắn chắn muốn kết thúc phòng này không ?'
      onConfirm={handleEndRoom}
      triggerClassName='w-fit'
      trigger={
        <Button
          className='rounded-full'
          loading={isPending}
          disabled={isPending}
          size='sm'
        >
          <FaVideoSlash className='text-rose-500' />
          Kết thúc
        </Button>
      }
    />
  );
}
