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
import { logger } from '@/logger';
import {
  useDeleteFileMutation,
  useUpdateProfileMutation,
  useUploadImageMutation
} from '@/queries';
import { updateProfileSchema } from '@/schemaValidations';
import { useAuthStore } from '@/store';
import { UpdateProfileBodyType } from '@/types';
import { applyFormErrors, notify, renderImageUrl } from '@/utils';
import type { UseFormReturn } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modal';

export default function ProfileForm() {
  const { profile } = useAuthStore(useShallow((s) => ({ profile: s.profile })));
  const { mutateAsync: uploadImageMutate, isPending: uploadImageLoading } =
    useUploadImageMutation();
  const { mutateAsync: updateProfileMutate, isPending: updateProfileLoading } =
    useUpdateProfileMutation();
  const { mutateAsync: deleteFileMutate } = useDeleteFileMutation();

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const imageManager = useFileUploadManager({
    initialUrl: profile?.avatarPath,
    deleteFileMutate: deleteFileMutate,
    isEditing: true,
    onOpen: true
  });

  const defaultValues: UpdateProfileBodyType = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    username: '',
    gender: GENDER_MALE,
    avatarPath: ''
  };

  const initialValues = {
    id: profile?.id || '',
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    username: profile?.username || '',
    gender: GENDER.includes(profile?.gender!) ? profile?.gender! : GENDER_MALE,
    avatarPath: profile?.avatarPath || ''
  };

  const onSubmit = async (
    values: UpdateProfileBodyType,
    form: UseFormReturn<UpdateProfileBodyType>
  ) => {
    await imageManager.handleSubmit();
    try {
      const res = await updateProfileMutate({
        ...values,
        avatarPath: imageManager.currentUrl
      });
      if (res.result) {
        notify.success('Cập nhật tài khoản thành công');
      } else {
        const errorCode = res.code;
        if (errorCode) {
          applyFormErrors(form, errorCode, profileErrorMaps);
        } else {
          notify.error('Cập nhật tài khoản thất bại');
        }
      }
    } catch (error) {
      logger.error('[UPDATE_PROFILE_ERROR]', error);
      notify.error('Cập nhật tài khoản thất bại');
    }
  };

  const handleCancel = async (form: UseFormReturn<UpdateProfileBodyType>) => {
    await imageManager.handleCancel(false);
    form.clearErrors();
    form.reset(initialValues);
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <h3 className='text-center text-xl font-semibold'>Tài khoản</h3>
      <p className='text-muted-foreground mt-2 text-center'>
        Cập nhật thông tin tài khoản
      </p>
      <BaseForm
        schema={updateProfileSchema}
        initialValues={initialValues}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className='mt-2 bg-transparent p-0'
      >
        {(form) => {
          return (
            <>
              <Row className='max-640:mb-4 flex-col gap-2'>
                <Col className='grid-c-12 grid-col-no-gutters mx-auto'>
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
                    avatar
                  />
                </Col>
              </Row>
              <Row className='max-640:gap-6'>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <InputField
                    control={form.control}
                    name='fullName'
                    label='Họ và tên'
                    required
                    placeholder='Nhập họ và tên'
                  />
                </Col>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <InputField
                    control={form.control}
                    name='email'
                    label='Email'
                    required
                    placeholder='Nhập email'
                    disabled
                  />
                </Col>
              </Row>
              <Row className='max-640:gap-6'>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <InputField
                    control={form.control}
                    name='username'
                    label='Tên hiển thị'
                    required
                    placeholder='Nhập tên hiển thị'
                  />
                </Col>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <InputField
                    control={form.control}
                    name='phone'
                    label='Số điện thoại'
                    required
                    placeholder='Nhập số điện thoại'
                  />
                </Col>
              </Row>
              <Row className='max-640:gap-6'>
                <Col className='grid-c-6 max-640:grid-c-12'>
                  <SelectField
                    control={form.control}
                    options={genderOptions}
                    name='gender'
                    label='Giới tính'
                    required
                    placeholder='Chọn giới tính'
                  />
                </Col>
              </Row>
              <Row className='max-480:mb-0 max-480:flex-col-reverse max-480:gap-6 mb-2 flex justify-end'>
                <Col className='grid-c-3 max-640:grid-c-6 max-480:grid-c-12'>
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
                    disabled={!form.formState.isDirty || updateProfileLoading}
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
                <Col className='grid-c-3 max-640:grid-c-6 max-480:grid-c-12'>
                  <Button
                    type='submit'
                    variant='primary'
                    className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
                    loading={updateProfileLoading}
                    disabled={!form.formState.isDirty || updateProfileLoading}
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </>
          );
        }}
      </BaseForm>
    </section>
  );
}
