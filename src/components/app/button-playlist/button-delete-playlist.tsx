'use client';

import { ToolTip } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useDeletePlaylistMutation } from '@/queries';
import { useAuth, useSelectedPlaylist } from '@/hooks';
import { notify, invalidateQueries } from '@/utils';
import { FaTrash } from 'react-icons/fa6';

type ButtonDeletePlaylistProps = {
  id: string;
};

export function ButtonDeletePlaylist({ id }: ButtonDeletePlaylistProps) {
  const { isAuthenticated } = useAuth();

  const { selectedPlaylist, setSelectedPlaylist } = useSelectedPlaylist();

  const { mutate: deletePlaylist, isPending } = useDeletePlaylistMutation();

  const handleDelete = () => {
    if (!isAuthenticated) return;

    deletePlaylist(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xóa danh sách phát thành công');
          invalidateQueries([queryKeys.PLAYLIST_LIST]);

          if (selectedPlaylist?.id === id) {
            setSelectedPlaylist(null);
          }
        } else {
          notify.error('Xóa danh sách phát thất bại');
        }
      },
      onError: (error) => {
        logger.error('[DELETE_PLAYLIST_ERROR]', error);
        notify.error('Xóa danh sách phát thất bại');
      }
    });
  };

  return (
    <ConfirmModal
      message='Bạn có chắc chắn muốn xóa danh sách phát này không ?'
      onConfirm={handleDelete}
      loading={isPending}
      trigger={
        <span>
          <ToolTip title='Xóa danh sách phát'>
            <button className='hover:text-destructive cursor-pointer rounded-full transition-all duration-200 ease-linear'>
              <FaTrash />
            </button>
          </ToolTip>
        </span>
      }
    />
  );
}
