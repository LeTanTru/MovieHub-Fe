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
import { FormDescription, FormLabel } from '@/components/ui/form';
import {
  apiConfig,
  queryKeys,
  ROOM_KIND_PRIVATE,
  ROOM_KIND_PUBLIC,
  roomKinds,
  storageKeys
} from '@/constants';
import { useAuth, useIsMounted, useNavigate } from '@/hooks';
import { logger } from '@/logger';
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
  useMovieItemQuery,
  useStartRoomMutation
} from '@/queries';
import { route } from '@/routes';
import { roomSchema } from '@/schemaValidations';
import type { RoomBodyType, UserAutoCompleteResType } from '@/types';
import {
  convertLocalToUTC,
  generateSlug,
  getData,
  invalidateQueries,
  notify
} from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
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
  const { profile } = useAuth();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false);

  const { mutate: createRoom, isPending } = useCreateRoomMutation();
  const { mutate: startRoom } = useStartRoomMutation();
  const { mutate: joinRoom } = useJoinRoomMutation();

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
    createRoom(
      {
        ...values,
        startTime: values.startTime ? convertLocalToUTC(values.startTime) : ''
      },
      {
        onSuccess: (res) => {
          if (!res.result || !res.data) {
            notify.error('Tạo phòng thất bại');
            return;
          }

          const roomId = res.data.id;
          notify.success('Tạo phòng thành công');

          if (values.isStartNow) {
            startRoom(roomId, {
              onSuccess: () => {
                joinRoom(roomId, {
                  onSuccess: () => {
                    navigate.push(
                      `${route.room.path}/${generateSlug(values.name)}.${roomId}`
                    );
                  }
                });
              },
              onError: (error) => {
                logger.error('[START_ROOM_ERROR]', error);
                navigate.push(
                  `${route.room.path}/${generateSlug(values.name)}.${roomId}`
                );
              }
            });
          } else {
            navigate.push(
              `${route.room.path}/${generateSlug(values.name)}.${roomId}`
            );
          }

          invalidateQueries([queryKeys.ROOM_LIST], [queryKeys.MY_ROOM_LIST]);
        },
        onError: (error) => {
          logger.error('[CREATE_NEW_ROOM_ERROR]', error);
          notify.error('Tạo phòng thất bại');
        }
      }
    );
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
            <Row className='bg-charade grid-row-no-gutters rounded-2xl px-4 py-8'>
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
            <Row className='bg-charade grid-row-no-gutters rounded-2xl px-4 py-8'>
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
            <Row className='bg-charade grid-row-no-gutters mb-6 gap-4 rounded-2xl px-4 py-8'>
              <Col className='grid-c-12 grid-col-no-gutters gap-4 text-base font-medium text-white'>
                <FormLabel>
                  3. Cài đặt thời gian
                  <span className='text-destructive'>*</span>
                </FormLabel>
                <FormDescription className='text-gray-400'>
                  Có thể bắt đầu thủ công hoặc tự động theo thời gian cài đặt.
                </FormDescription>
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
              <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                <DateTimePickerField
                  control={form.control}
                  disabled={isStartNow}
                  label='Thời gian'
                  name='startTime'
                  placeholder='Thời gian bắt đầu'
                  required
                />
              </Col>
            </Row>
            <Row className='bg-charade grid-row-no-gutters mb-6 gap-4 rounded-2xl px-4 py-8'>
              <Col className='grid-c-12 grid-col-no-gutters text-base font-medium text-white'>
                <AutoCompleteField<RoomBodyType, UserAutoCompleteResType>
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
                  label='4. Mời mọi người tham gia'
                  isMulti
                  isMultiLine
                  placeholder='Mời mọi người tham gia'
                  disabled={roomKind !== ROOM_KIND_PRIVATE}
                />
              </Col>
            </Row>
            <Row className='mb-0 gap-6'>
              <Col className='grid-c-12'>
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
              <Col className='grid-c-12'>
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
                >
                  Hủy
                </Button>
                <ConfirmModal
                  open={showConfirmCancel}
                  onOpenChange={setShowConfirmCancel}
                  message='Bạn có chắc chắn muốn hủy không ?'
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

NewRoomForm.Skeleton = function NewRoomFormSkeleton() {
  return (
    <div className='flex w-full flex-col gap-6'>
      {/* 1. Room name */}
      <div className='bg-charade rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <Skeleton className='h-3.5 w-28 bg-white/10' />
          <Skeleton className='h-9 w-full bg-white/8' />
        </div>
      </div>

      {/* 2. Room kind */}
      <div className='bg-charade rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <Skeleton className='h-3.5 w-24 bg-white/10' />
          <Skeleton className='h-9 w-full bg-white/8' />
        </div>
      </div>

      {/* 3. Settings */}
      <div className='bg-charade rounded-2xl px-4 py-8'>
        <div className='space-y-4'>
          <Skeleton className='h-3.5 w-40 bg-white/10' />
          <Skeleton className='h-4 w-72 bg-white/6' />
          <div className='flex items-center gap-3'>
            <Skeleton className='h-6 w-11 rounded-full bg-white/10' />
            <Skeleton className='h-3.5 w-52 bg-white/8' />
          </div>
          <Skeleton className='mb-3 h-3.5 w-20 bg-white/10' />
          <Skeleton className='h-9 w-full bg-white/8' />
        </div>
      </div>

      {/* 4. Invite */}
      <div className='bg-charade rounded-2xl px-4 py-8'>
        <div className='space-y-2'>
          <Skeleton className='h-3.5 w-44 bg-white/10' />
          <Skeleton className='h-9 w-full bg-white/8' />
        </div>
      </div>

      {/* 5. Actions */}
      <div className='flex flex-col gap-6'>
        <Skeleton className='bg-golden-glow/30 h-9 w-full' />
        <Skeleton className='h-9 w-full bg-white/10' />
      </div>
    </div>
  );
};
