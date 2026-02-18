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
import { useAuth, useFileUploadManager } from '@/hooks';
import { logger } from '@/logger';
import {
  useDeleteFileMutation,
  useUpdateProfileMutation,
  useUploadImageMutation
} from '@/queries';
import { updateProfileSchema } from '@/schemaValidations';
import { ProfileResType, UpdateProfileType } from '@/types';
import { applyFormErrors, notify, renderImageUrl } from '@/utils';
import type { UseFormReturn } from 'react-hook-form';

export default function ProfileForm() {
  const { profile } = useAuth();
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
    id: '',
    fullName: '',
    email: '',
    phone: '',
    username: '',
    gender: GENDER_MALE,
    avatarPath: ''
  };

  const initialValues = {
    id: profile?.id?.toString() || '',
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    username: profile?.username || '',
    gender: GENDER.includes(profile?.gender!) ? profile?.gender! : GENDER_MALE,
    avatarPath: profile?.avatarPath || ''
  };

  const onSubmit = async (
    values: UpdateProfileType,
    form: UseFormReturn<UpdateProfileType>
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
      logger.error('Error while updating profile: ', error);
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  const handleCancel = async (form: UseFormReturn<UpdateProfileType>) => {
    await imageManager.handleCancel(false);
    form.clearErrors();
    form.reset(initialValues);
  };

  return (
    <section className='bg-auth-form rounded-lg px-6 py-4'>
      <h3 className='text-center text-xl font-semibold'>Tài khoản</h3>
      <p className='text-muted-foreground mt-2 text-center text-sm'>
        Cập nhật thông tin tài khoản
      </p>
      <BaseForm
        schema={updateProfileSchema}
        initialValues={initialValues}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className='mt-2 p-0'
      >
        {(form) => {
          return (
            <>
              <Row className='flex-col gap-2'>
                <Col span={24} className='mx-auto'>
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
                  <Row>
                    <Col span={12}>
                      <InputField
                        control={form.control}
                        name='fullName'
                        label='Họ và tên'
                        required
                        placeholder='Nhập họ và tên'
                        className='text-sm'
                      />
                    </Col>
                    <Col span={12}>
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
                  <Row>
                    <Col span={12}>
                      <InputField
                        control={form.control}
                        name='username'
                        label='Tên hiển thị'
                        required
                        placeholder='Nhập tên hiển thị'
                        className='text-sm'
                      />
                    </Col>
                    <Col span={12}>
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
                  <Row className='mb-0'>
                    <Col span={12}>
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
                </Col>
              </Row>
              <Row className='mb-2 flex justify-end gap-2'>
                <Col span={6}>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => handleCancel(form)}
                    disabled={!form.formState.isDirty}
                  >
                    Hủy
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    type='submit'
                    variant='primary'
                    className='dark:bg-light-golden-yellow dark:hover:bg-light-golden-yellow/80 dark:disabled:bg-light-golden-yellow/80 dark:disabled:hover:bg-light-golden-yellow/80'
                    loading={updateProfileLoading}
                    disabled={!form.formState.isDirty}
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
