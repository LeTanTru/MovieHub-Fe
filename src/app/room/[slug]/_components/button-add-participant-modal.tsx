'use client';

import { AutoCompleteField, Button, Col, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Modal } from '@/components/modal';
import { apiConfig, queryKeys } from '@/constants';
import { useAuth, useDisclosure } from '@/hooks';
import { logger } from '@/logger';
import { useAddParticipantsMutation } from '@/queries';
import { roomAddParticipantSchema } from '@/schemaValidations';
import { useRoomStore } from '@/store';
import { RoomAddParticipantBodyType, UserAutoCompleteResType } from '@/types';
import { invalidateQueries, notify } from '@/utils';
import { UserPlus } from 'lucide-react';
import { useMemo } from 'react';

export function ButtonAddParticipantModal() {
  const { profile } = useAuth();
  const room = useRoomStore((state) => state.room);

  const {
    opened: openedAddParticipantModal,
    open: openAddParticipantModal,
    close: closeAddParticipantModal
  } = useDisclosure();

  const { mutate: addParticipants, isPending } = useAddParticipantsMutation();

  const defaultValues: RoomAddParticipantBodyType = useMemo(
    () => ({
      roomId: room?.id || '',
      accountIds: []
    }),
    [room?.id]
  );

  const onSubmit = (values: RoomAddParticipantBodyType) => {
    addParticipants(values, {
      onSuccess: (res) => {
        if (!res.result) {
          notify.error('Mời mọi người thất bại');
          return;
        }

        notify.success('Mời mọi người thành công');
        invalidateQueries([queryKeys.ROOM, room?.id || '']);
        closeAddParticipantModal();
      },
      onError: (error) => {
        logger.error('[ROOM_ADD_PARTICIPANTS_ERROR]', error);
        notify.error('Mời mọi người thất bại');
      }
    });
  };

  return (
    <>
      <button
        onClick={openAddParticipantModal}
        className='hover:text-golden-glow inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
      >
        <UserPlus className='size-4' />
        <span className='max-800:hidden'>Mời mọi người</span>
      </button>

      <Modal
        open={openedAddParticipantModal}
        onClose={closeAddParticipantModal}
      >
        <Modal.Header>Mời mọi người</Modal.Header>
        <Modal.Body scrollable className='max-h-[min(32.5rem,75vh)]'>
          <BaseForm
            onSubmit={onSubmit}
            schema={roomAddParticipantSchema}
            defaultValues={defaultValues}
            initialValues={defaultValues}
            className='bg-transparent'
          >
            {(form) => (
              <>
                <Row>
                  <Col className='grid-c-12 grid-col-no-gutters'>
                    <AutoCompleteField<
                      RoomAddParticipantBodyType,
                      UserAutoCompleteResType
                    >
                      control={form.control}
                      name='accountIds'
                      apiConfig={apiConfig.user.autoComplete}
                      mappingData={(option) => ({
                        value: option.id,
                        label: option.fullName,
                        email: option.email
                      })}
                      renderOption={(option) => {
                        const user = option.extra;
                        return (
                          <span>
                            {user?.fullName} ({user?.email})
                          </span>
                        );
                      }}
                      searchParams={['fullName']}
                      initialParams={{ ignoreUserId: profile?.id }}
                      isMulti
                      isMultiLine
                      placeholder='Mời mọi người tham gia'
                    />
                  </Col>
                </Row>
                <Row className='bg-charade sticky bottom-0 z-10 -mx-4 mt-4 -mb-4 flex items-center justify-center border-t px-4 py-4'>
                  <Col className='grid-c-6'>
                    <Button type='button' onClick={closeAddParticipantModal}>
                      Đóng
                    </Button>
                  </Col>
                  <Col className='grid-c-6'>
                    <Button
                      type='submit'
                      variant='primary'
                      className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
                      loading={isPending}
                      disabled={!form.formState.isDirty || isPending}
                    >
                      Mời
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </BaseForm>
        </Modal.Body>
      </Modal>
    </>
  );
}
