'use client';

import { Button, Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useCreatePlayListMutation,
  useUpdatePlaylistMutation
} from '@/queries';
import { playlistSchema } from '@/schemaValidations';
import { PlaylistBodyType, PlaylistResType } from '@/types';
import { notify, invalidateQueries } from '@/utils';
import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks';

type PlaylistModalProps = {
  opened: boolean;
  onClose: () => void;
  playlist?: PlaylistResType;
};

const defaultValues: PlaylistBodyType = {
  id: '',
  name: ''
};

export function PlaylistModal({
  opened,
  onClose,
  playlist
}: PlaylistModalProps) {
  const { isAuthenticated } = useAuth();

  const { mutate: createPlaylistMutate, isPending: createPlaylistLoading } =
    useCreatePlayListMutation();

  const { mutate: updatePlaylistMutate, isPending: updatePlaylistLoading } =
    useUpdatePlaylistMutation();

  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const loading = createPlaylistLoading || updatePlaylistLoading;
  const isEditing = !!playlist;

  const initialValues: PlaylistBodyType = useMemo(
    () => ({
      id: playlist?.id ?? defaultValues.id,
      name: playlist?.name ?? defaultValues.name
    }),
    [playlist?.id, playlist?.name]
  );

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (values: PlaylistBodyType) => {
    if (!isAuthenticated) return;

    const mutate = isEditing ? updatePlaylistMutate : createPlaylistMutate;
    mutate(
      {
        ...values
      },
      {
        onSuccess: async (res) => {
          if (res.result) {
            notify.success(
              `${isEditing ? 'Cập nhật' : 'Thêm'} danh sách phát thành công`
            );
            invalidateQueries([queryKeys.PLAYLIST_LIST]);
            handleClose();
          } else {
            notify.error(
              `${isEditing ? 'Cập nhật' : 'Thêm'} danh sách phát thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error('[CREATE_UPDATE_PLAYLIST_ERROR]', error);
          notify.error(
            `${isEditing ? 'Cập nhật' : 'Thêm'} danh sách phát thất bại`
          );
        }
      }
    );
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      className='bg-main-background max-480:w-[90%] max-990:w-100 top-1/2 left-1/2 mx-0 w-75 -translate-x-1/2 -translate-y-1/2 rounded-lg'
      confirmOnClose={isFormChanged}
    >
      <Modal.Header className='h-fit justify-end pb-0'>
        <span className='sr-only'>
          {isEditing ? 'Cập nhật danh sách phát' : 'Thêm danh sách phát'}
        </span>
      </Modal.Header>
      <Modal.Body>
        <BaseForm
          schema={playlistSchema}
          defaultValues={defaultValues}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          className='bg-transparent pt-0'
          onFormChange={setIsFormChanged}
        >
          {(form) => (
            <>
              <Row className='mb-6'>
                <Col className='grid-c-12'>
                  <InputField
                    control={form.control}
                    name='name'
                    label='Tên danh sách phát'
                    placeholder='Tên danh sách phát'
                    required
                    className='max-640:text-[13px]'
                    labelClassName='max-640:text-[13px]'
                  />
                </Col>
              </Row>
              <Row className='mb-0 justify-center'>
                <Col className='grid-c-6'>
                  <Button
                    variant='primary'
                    className='max-640:text-[13px]'
                    onClick={handleClose}
                    type='button'
                  >
                    Đóng
                  </Button>
                </Col>
                <Col className='grid-c-6'>
                  <Button
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 max-640:text-[13px]'
                    variant='primary'
                    disabled={!form.formState.isDirty || loading}
                    type='submit'
                    loading={loading}
                  >
                    {isEditing ? 'Cập nhật' : 'Thêm'}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </BaseForm>
      </Modal.Body>
      <Modal.Confirm message='Bạn có chắc chắn muốn hủy không?' />
    </Modal>
  );
}
