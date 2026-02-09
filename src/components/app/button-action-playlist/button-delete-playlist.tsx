'use client';

import { Button, Col, Row, ToolTip } from '@/components/form';
import { Modal } from '@/components/modal';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { useDisclosure } from '@/hooks';
import { useDeletePlaylistMutation } from '@/queries';
import { notify } from '@/utils';
import { FaTrash } from 'react-icons/fa6';

export default function ButtonDeletePlaylist({ id }: { id: string }) {
  const { opened, open, close } = useDisclosure();
  const queryClient = getQueryClient();

  const { mutateAsync: deletePlaylistMutate, isPending } =
    useDeletePlaylistMutation();

  const handleOpen = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  const handleDelete = async () => {
    await deletePlaylistMutate(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xóa danh sách phát thành công');
          queryClient.invalidateQueries({
            queryKey: [queryKeys.PLAYLIST_LIST]
          });
          handleClose();
        }
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
          className='hover:text-light-golden-yellow hover:border-light-golden-yellow rounded-full'
          onClick={handleOpen}
        >
          <FaTrash />
        </button>
      </ToolTip>
      <Modal
        open={opened}
        onClose={handleClose}
        bodyWrapperClassName='bg-main-background w-110 h-fit min-h-fit'
        bodyClassName='p-4 pt-0'
        headerClassName='text-sm'
        closeOnBackdropClick={!isPending}
        variants={{
          initial: {
            opacity: 0.8,
            scale: 0.8
          },
          animate: {
            opacity: 1,
            scale: 1
          },
          exit: {
            opacity: 0.8,
            scale: 0.8
          }
        }}
        transition={{
          duration: 0.2,
          ease: 'linear'
        }}
      >
        <h3>Bạn có chắc chắn muốn xóa danh sách phát này không?</h3>
        <Row className='mt-4 mb-0 justify-end'>
          <Col span={6}>
            <Button
              className='bg-white text-black'
              variant='primary'
              onClick={handleClose}
            >
              Đóng
            </Button>
          </Col>
          <Col span={6}>
            <Button
              className='bg-[#dc3545]!'
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
