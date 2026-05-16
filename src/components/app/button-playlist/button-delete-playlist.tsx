'use client';

import { ToolTip } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useDeletePlaylistMutation } from '@/queries';
import { usePlaylistStore } from '@/store';
import { notify, invalidateQueries } from '@/utils';
import { FaTrash } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';
import { useAuth } from '@/hooks';

type ButtonDeletePlaylistProps = {
  id: string;
};

export default function ButtonDeletePlaylist({
  id
}: ButtonDeletePlaylistProps) {
  const { isAuthenticated } = useAuth();

  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );

  const { mutateAsync: deletePlaylistMutate, isPending } =
    useDeletePlaylistMutation();

  const handleDelete = async () => {
    if (!isAuthenticated) return;

    await deletePlaylistMutate(id, {
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
      message='Bạn có chắc chắn muốn xóa danh sách phát này không?'
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
