'use client';

import { Button, Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useCreatePlayListMutation,
  useUpdatePlaylistMutation
} from '@/queries';
import { playlistSchema } from '@/schemaValidations';
import { PlaylistBodyType, PlaylistResType } from '@/types';
import { notify } from '@/utils';
import { useState } from 'react';

export default function PlaylistModal({
  opened,
  onClose,
  playlist
}: {
  opened: boolean;
  onClose: () => void;
  playlist?: PlaylistResType;
}) {
  const queryClient = getQueryClient();
  const {
    mutateAsync: createPlaylistMutate,
    isPending: createPlaylistLoading
  } = useCreatePlayListMutation();
  const {
    mutateAsync: updatePlaylistMutate,
    isPending: updatePlaylistLoading
  } = useUpdatePlaylistMutation();

  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const loading = createPlaylistLoading || updatePlaylistLoading;
  const isEditing = !!playlist;

  const defaultValues: PlaylistBodyType = {
    id: '',
    name: ''
  };

  const initialValues: PlaylistBodyType = {
    id: playlist?.id || '',
    name: playlist?.name || ''
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (values: PlaylistBodyType) => {
    const mutate = isEditing ? updatePlaylistMutate : createPlaylistMutate;
    await mutate(
      {
        ...values
      },
      {
        onSuccess: async (res) => {
          if (res.result) {
            notify.success(
              `${isEditing ? 'Cập nhật' : 'Thêm'} danh sách phát thành công`
            );
            await queryClient.invalidateQueries({
              queryKey: [queryKeys.PLAYLIST_LIST]
            });
            handleClose();
          } else {
            notify.error(
              `${isEditing ? 'Cập nhật' : 'Thêm'} danh sách phát thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error('Error while creating/updating playlist:', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  return (
    <Modal
      open={opened}
      onClose={onClose}
      bodyWrapperClassName='bg-main-background w-75'
      confirmOnClose={isFormChanged}
    >
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
            <Row className='mb-4'>
              <Col span={24}>
                <InputField
                  control={form.control}
                  name='name'
                  label='Tên danh sách phát'
                  placeholder='Tên danh sách phát'
                  required
                />
              </Col>
            </Row>
            <Row className='mb-0'>
              <Col span={12}>
                <Button variant='primary' onClick={handleClose}>
                  Đóng
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
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
    </Modal>
  );
}
