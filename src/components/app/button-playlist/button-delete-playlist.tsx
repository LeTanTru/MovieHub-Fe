'use client';

import { ToolTip } from '@/components/form';
import { ConfirmModal } from '@/components/modal';
import { getQueryClient } from '@/components/providers/query-provider';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useDeletePlaylistMutation } from '@/queries';
import { usePlaylistStore } from '@/store';
import { ApiResponse, PlaylistResType } from '@/types';
import { notify } from '@/utils';
import { FaTrash } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

type ButtonDeletePlaylistProps = {
  id: string;
};

export default function ButtonDeletePlaylist({
  id
}: ButtonDeletePlaylistProps) {
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );
  const queryClient = getQueryClient();

  const { mutateAsync: deletePlaylistMutate, isPending } =
    useDeletePlaylistMutation();

  const handleDelete = async () => {
    await deletePlaylistMutate(id, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Xóa danh sách phát thành công');
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.PLAYLIST_LIST]
          });
          const playlistData = queryClient.getQueryData<
            ApiResponse<PlaylistResType[]>
          >([queryKeys.PLAYLIST_LIST]);
          const playlist = playlistData?.data || [];
          if (playlist.findIndex((p) => p.id === selectedPlaylist?.id) === -1) {
            setSelectedPlaylist(playlist[0] || null);
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
