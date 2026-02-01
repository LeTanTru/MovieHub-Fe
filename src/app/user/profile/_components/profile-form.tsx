'use client';

import {
  Button,
  Col,
  InputField,
  Row,
  SelectField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import {
  GENDER,
  GENDER_MALE,
  genderOptions,
  profileErrorMaps
} from '@/constants';
import { useFileUploadManager } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useDeleteFileMutation,
  useUpdateProfileMutation,
  useUploadImageMutation
} from '@/queries';
import { updateProfileSchema } from '@/schemaValidations';
import { useAuthStore } from '@/store';
import { ProfileResType, ProfileType, UpdateProfileType } from '@/types';
import { applyFormErrors, notify, renderImageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export default function ProfileForm() {
  const { profile } = useAuthStore();
  const { mutateAsync: uploadImageMutate, isPending: uploadImageLoading } =
    useUploadImageMutation();
  const { mutateAsync: updateProfileMutate, isPending: updateProfileLoading } =
    useUpdateProfileMutation();
  const { mutateAsync: deleteFileMutate } = useDeleteFileMutation();

  const imageManager = useFileUploadManager({
    initialUrl: profile?.avatarPath,
    deleteFileMutate: deleteFileMutate,
    isEditing: true,
    onOpen: true
  });

  const defaultValues: ProfileResType = {
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    username: '',
    gender: GENDER_MALE,
    avatarPath: ''
  };

  const initialValues = useMemo<ProfileResType>(
    () => ({
      id: profile?.id || 0,
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      username: profile?.username || '',
      gender: GENDER.includes(profile?.gender!)
        ? profile?.gender!
        : GENDER_MALE,
      avatarPath: profile?.avatarPath || ''
    }),
    [
      profile?.avatarPath,
      profile?.email,
      profile?.fullName,
      profile?.gender,
      profile?.id,
      profile?.phone,
      profile?.username
    ]
  );

  const onSubmit = async (
    values: UpdateProfileType,
    form: UseFormReturn<ProfileType>
  ) => {
    await imageManager.handleSubmit();
    try {
      const res = await updateProfileMutate({
        ...values,
        avatarPath: imageManager.currentUrl
      });
      if (res.result) {
        notify.success('Cập nhật thành công');
      } else {
        const errorCode = res.code;
        if (errorCode) {
          applyFormErrors(form, errorCode, profileErrorMaps);
        } else {
          notify.error('Có lỗi xảy ra');
        }
      }
    } catch (error) {
      logger.error('Error while updating profile: ', error);
      notify.error('Cập nhật thất bại');
    }
  };

  const handleCancel = async (form: UseFormReturn<ProfileType>) => {
    await imageManager.handleCancel(false);
    form.clearErrors();
    form.reset(initialValues);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className='bg-main-background max-1120:mx-auto max-1120:mt-8 max-1120:w-140 max-1368:w-5/6 max-600:w-full relative mx-auto rounded-lg'
      >
        <h1 className='max-1120:text-center'>Tài khoản</h1>
        <p className='max-1120:text-center mt-2 text-sm text-slate-400'>
          Cập nhật thông tin tài khoản
        </p>
        <BaseForm
          schema={updateProfileSchema}
          initialValues={initialValues}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        >
          {(form) => {
            return (
              <>
                <Row className='max-1120:mt-10 max-1120:items-center max-1120:gap-0 flex-col gap-2'>
                  <Col
                    span={24}
                    className='max-1120:mb-4 max-1120:w-full mx-auto w-1/6'
                  >
                    <UploadImageField
                      value={renderImageUrl(imageManager.currentUrl)}
                      control={form.control}
                      name='avatarPath'
                      label='Ảnh đại diện'
                      onChange={imageManager.trackUpload}
                      uploadImageFn={async (file: Blob) => {
                        const res = await uploadImageMutate({
                          file
                        });
                        return res.data?.filePath ?? '';
                      }}
                      loading={uploadImageLoading}
                      deleteImageFn={imageManager.handleDeleteOnClick}
                      size={100}
                    />
                  </Col>
                  <Col span={24}>
                    <Row className='max-1120:mt-0 max-1120:flex-col max-1120:gap-4'>
                      <Col span={12} className='max-1120:w-full'>
                        <InputField
                          control={form.control}
                          name='fullName'
                          label='Họ và tên'
                          required
                          placeholder='Nhập họ và tên'
                          className='text-sm'
                        />
                      </Col>
                      <Col span={12} className='max-1120:w-full'>
                        <InputField
                          control={form.control}
                          name='email'
                          label='Email'
                          required
                          placeholder='Nhập email'
                          className='text-sm disabled:opacity-100'
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row className='max-1120:mt-0 max-1120:flex-col max-1120:gap-4'>
                      <Col span={12} className='max-1120:w-full'>
                        <InputField
                          control={form.control}
                          name='username'
                          label='Tên hiển thị'
                          required
                          placeholder='Nhập tên hiển thị'
                          className='text-sm'
                        />
                      </Col>
                      <Col span={12} className='max-1120:w-full'>
                        <InputField
                          control={form.control}
                          name='phone'
                          label='Số điện thoại'
                          required
                          placeholder='Nhập số điện thoại'
                          className='text-sm'
                        />
                      </Col>
                    </Row>
                    <Row className='max-1120:mt-0 max-1120:flex-col max-1120:gap-4'>
                      <Col span={12} className='max-1120:w-full'>
                        <SelectField
                          control={form.control}
                          options={genderOptions}
                          name='gender'
                          label='Giới tính'
                          required
                          placeholder='Chọn giới tính'
                          className='text-sm'
                        />
                      </Col>
                    </Row>
                    <div className='max-1120:mt-4 flex justify-end gap-2'>
                      <Button
                        type='button'
                        className={cn('ml-2 w-32')}
                        variant={'outline'}
                        onClick={() => handleCancel(form)}
                        disabled={!form.formState.isDirty}
                      >
                        Hủy
                      </Button>
                      <Button
                        type='submit'
                        variant='primary'
                        className={cn('ml-2 w-32')}
                        loading={updateProfileLoading}
                        disabled={!form.formState.isDirty}
                      >
                        Cập nhật
                      </Button>
                    </div>
                  </Col>
                </Row>
              </>
            );
          }}
        </BaseForm>
      </motion.div>
    </AnimatePresence>
  );
}
