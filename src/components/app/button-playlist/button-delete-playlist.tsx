'use client';

import { Button, Col, Row, ToolTip } from '@/components/form';
import { Modal } from '@/components/modal';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { useDisclosure } from '@/hooks';
import { logger } from '@/logger';
import { useDeletePlaylistMutation } from '@/queries';
import { usePlaylistStore } from '@/store';
import { ApiResponse, PlaylistResType } from '@/types';
import { notify } from '@/utils';
import { FaTrash } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export default function ButtonDeletePlaylist({ id }: { id: string }) {
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );
  const { opened, open, close } = useDisclosure();
  const queryClient = getQueryClient();

  const { mutateAsync: deletePlaylistMutate, isPending } =
    useDeletePlaylistMutation();

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    open();
  };

  const handleClose = () => {
    close();
  };

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
          handleClose();
        } else {
          notify.error('Xóa danh sách phát thất bại');
        }
      },
      onError: (error) => {
        logger.error('Error while deleting playlist', error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  };

  return (
    <>
      <ToolTip
        title='Xóa danh sách phát'
        className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
      >
        <button
          className='hover:text-destructive cursor-pointer rounded-full transition-all duration-200 ease-linear'
          onClick={handleOpen}
        >
          <FaTrash />
        </button>
      </ToolTip>
      <Modal
        open={opened}
        onClose={handleClose}
        className='bg-transparent'
        bodyWrapperClassName='bg-main-background w-110'
        bodyClassName='p-4 pt-0'
      >
        <h3>Bạn có chắc chắn muốn xóa danh sách phát này không?</h3>
        <Row className='mt-4 mb-0 justify-end'>
          <Col span={6}>
            <Button variant='primary' onClick={handleClose}>
              Đóng
            </Button>
          </Col>
          <Col span={6}>
            <Button
              className='dark:bg-red-500'
              variant='destructive'
              disabled={isPending}
              loading={isPending}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
