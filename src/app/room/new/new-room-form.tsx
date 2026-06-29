'use client';

import {
  AutoCompleteField,
  BooleanField,
  Button,
  Col,
  DateTimePickerField,
  InputField,
  Row,
  SelectField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { ConfirmModal } from '@/components/modal';
import { FormLabel } from '@/components/ui/form';
import {
  apiConfig,
  queryKeys,
  ROOM_KIND_PRIVATE,
  ROOM_KIND_PUBLIC,
  roomKinds,
  storageKeys
} from '@/constants';
import { useIsMounted, useNavigate } from '@/hooks';
import { logger } from '@/logger';
import { useCreateRoomMutation, useMovieItemQuery } from '@/queries';
import { route } from '@/routes';
import { roomSchema } from '@/schemaValidations';
import { RoomBodyType, UserAutoCompleteResType } from '@/types';
import { getData, invalidateQueries, notify } from '@/utils';
import { useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const defaultValues: RoomBodyType = {
  accountIds: [],
  isStartNow: true,
  kind: ROOM_KIND_PUBLIC,
  movieItemId: '',
  name: '',
  startTime: ''
};

export default function NewRoomForm() {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false);
  const { mutate: createRoom, isPending } = useCreateRoomMutation();

  const [movieItemId] = useState(
    () => getData(storageKeys.ROOM_MOVIE_ITEM_ID) || ''
  );

  const { data: movieItem } = useMovieItemQuery({
    id: movieItemId,
    enabled: !!movieItemId
  });

  const initialValues: RoomBodyType = useMemo(() => {
    return {
      accountIds: defaultValues.accountIds,
      isStartNow: defaultValues.isStartNow,
      kind: ROOM_KIND_PUBLIC,
      movieItemId,
      name: `Cùng xem ${movieItem?.movie?.title || ''}`,
      startTime: ''
    };
  }, [movieItem?.movie?.title, movieItemId]);

  const onSubmit = (values: RoomBodyType) => {
    createRoom(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Tạo phòng thành công');
          navigate.push(route.room.manage.path);
          invalidateQueries([queryKeys.ROOM_LIST], [queryKeys.MY_ROOM_LIST]);
        } else {
          notify.error('Tạo phòng thất bại');
        }
      },
      onError: (error) => {
        logger.error('[CREATE_NEW_ROOM_ERROR]', error);
        notify.error('Tạo phòng thất bại');
      }
    });
  };

  const handleCancel = (form: UseFormReturn<RoomBodyType>) => {
    form.clearErrors();
    form.reset(defaultValues);
    navigate.back();
  };

  if (!isMounted) return <NewRoomForm.Skeleton />;

  return (
    <BaseForm
      className='w-full bg-transparent p-0'
      defaultValues={defaultValues}
      initialValues={initialValues}
      onSubmit={onSubmit}
      schema={roomSchema}
    >
      {(form) => {
        const isStartNow = form.watch('isStartNow');
        const roomKind = form.watch('kind');

        return (
          <>
            <Row className='bg-charade grid-row-no-gutters mb-3 rounded-2xl px-4 py-8'>
              <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                <InputField
                  control={form.control}
                  name='name'
                  label='1. Tên phòng'
                  placeholder='Nhập tên phòng'
                  required
                />
              </Col>
            </Row>
            <Row className='bg-charade grid-row-no-gutters mb-3 rounded-2xl px-4 py-8'>
              <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                <SelectField
                  control={form.control}
                  name='kind'
                  label='2. Loại phòng'
                  options={roomKinds}
                  required
                />
              </Col>
            </Row>
            <Row className='bg-charade grid-row-no-gutters mb-3 gap-4 rounded-2xl px-4 py-8'>
              <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                <FormLabel className='mb-4'>
                  3. Cài đặt thời gian
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <BooleanField
                  formItemClassName='flex-col flex'
                  control={form.control}
                  name='isStartNow'
                  label='Bắt đầu ngay hoặc chọn thời gian'
                  className='data-[state=checked]:bg-zinc-600'
                  checkClassName='peer-data-[state=checked]:text-golden-glow'
                  thumbClassName='dark:data-[state=checked]:bg-golden-glow'
                />
              </Col>
              {!isStartNow && (
                <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                  <DateTimePickerField
                    control={form.control}
                    name='startTime'
                    label='Thời gian'
                    placeholder='Thời gian bắt đầu'
                    required
                  />
                </Col>
              )}
            </Row>
            {roomKind === ROOM_KIND_PRIVATE && (
              <Row className='bg-charade grid-row-no-gutters mb-3 gap-4 rounded-2xl px-4 py-8'>
                <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                  <AutoCompleteField<RoomBodyType, UserAutoCompleteResType>
                    control={form.control}
                    name='accountIds'
                    apiConfig={apiConfig.user.autoComplete}
                    mappingData={(option) => ({
                      value: option.id,
                      label: option.fullName
                    })}
                    searchParams={['fullName']}
                    label='4. Mời mọi người tham gia'
                    isMulti
                    isMultiLine
                    placeholder='Mời mọi người tham gia'
                  />
                </Col>
              </Row>
            )}
            <Row className='mb-0 gap-4'>
              <Col className='grid-c-12 max-640:grid-c-6 max-480:grid-c-12'>
                <Button
                  type='submit'
                  variant='primary'
                  className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
                  disabled={isPending}
                  loading={isPending}
                >
                  Tạo phòng
                </Button>
              </Col>
              <Col className='grid-c-12 max-640:grid-c-6 max-480:grid-c-12'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    if (form.formState.isDirty) {
                      setShowConfirmCancel(true);
                    } else {
                      handleCancel(form);
                    }
                  }}
                  disabled={isPending}
                  className='border-gray-200 text-white hover:border-gray-200/80 hover:text-white/80 disabled:border-gray-200/80 disabled:text-white/80 disabled:hover:border-gray-200/80 disabled:hover:text-white/80'
                >
                  Hủy
                </Button>
                <ConfirmModal
                  open={showConfirmCancel}
                  onOpenChange={setShowConfirmCancel}
                  message='Bạn có chắc chắn muốn hủy không?'
                  onConfirm={() => handleCancel(form)}
                />
              </Col>
            </Row>
          </>
        );
      }}
    </BaseForm>
  );
}

NewRoomForm.Skeleton = function () {
  return (
    <div className='w-full'>
      {/* Room name */}
      <div className='bg-charade mb-3 rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <div className='h-3.5 w-28 animate-pulse rounded bg-white/10' />
          <div className='h-9 w-full animate-pulse rounded-md bg-white/8' />
        </div>
      </div>

      {/* Room kind */}
      <div className='bg-charade mb-3 rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <div className='h-3.5 w-24 animate-pulse rounded bg-white/10' />
          <div className='h-9 w-full animate-pulse rounded-md bg-white/8' />
        </div>
      </div>

      {/* Invite */}
      <div className='bg-charade mb-3 rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <div className='h-3.5 w-44 animate-pulse rounded bg-white/10' />
          <div className='h-9 w-full animate-pulse rounded-md bg-white/8' />
        </div>
      </div>

      {/* Schedule */}
      <div className='bg-charade mb-3 rounded-2xl px-4 py-8'>
        <div className='space-y-4'>
          <div className='h-3.5 w-40 animate-pulse rounded bg-white/10' />
          <div className='flex items-center gap-3'>
            <div className='h-6 w-11 animate-pulse rounded-full bg-white/10' />
            <div className='h-3.5 w-52 animate-pulse rounded bg-white/8' />
          </div>
          <div className='space-y-2'>
            <div className='h-3.5 w-20 animate-pulse rounded bg-white/10' />
            <div className='h-9 w-full animate-pulse rounded-md bg-white/8' />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col gap-4'>
        <div className='bg-golden-glow/30 h-9 w-full animate-pulse rounded-md' />
        <div className='h-9 w-full animate-pulse rounded-md bg-white/10' />
      </div>
    </div>
  );
};
