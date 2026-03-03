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
import { ProfileResType, UpdateProfileType } from '@/types';
import { applyFormErrors, notify, renderImageUrl } from '@/utils';
import type { UseFormReturn } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

export default function ProfileForm() {
  const { profile } = useAuthStore(useShallow((s) => ({ profile: s.profile })));
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
    id: profile?.id || '',
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
    <section className='bg-vintage-blue rounded-lg px-6 py-4 max-[520px]:px-4'>
      <h3 className='text-center text-xl font-semibold'>Tài khoản</h3>
      <p className='text-muted-foreground mt-2 text-center text-sm'>
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
              <Row className='flex-col gap-2 max-[640px]:mb-4'>
                <Col className='mx-auto'>
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
                <Col>
                  <Row className='max-[640px]:mb-4 max-[640px]:*:mb-4 max-[400px]:mb-0'>
                    <Col className='w-1/2 max-[640px]:w-full'>
                      <InputField
                        control={form.control}
                        name='fullName'
                        label='Họ và tên'
                        required
                        placeholder='Nhập họ và tên'
                        className='text-sm'
                      />
                    </Col>
                    <Col className='w-1/2 max-[640px]:w-full'>
                      <InputField
                        control={form.control}
                        name='email'
                        label='Email'
                        required
                        placeholder='Nhập email'
                        className='text-sm disabled:border-gray-500 disabled:opacity-100'
                      />
                    </Col>
                  </Row>
                  <Row className='max-[640px]:mb-4 max-[640px]:*:mb-4 max-[400px]:mb-0'>
                    <Col className='w-1/2 max-[640px]:w-full'>
                      <InputField
                        control={form.control}
                        name='username'
                        label='Tên hiển thị'
                        required
                        placeholder='Nhập tên hiển thị'
                        className='text-sm'
                      />
                    </Col>
                    <Col className='w-1/2 max-[640px]:w-full'>
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
                    <Col className='w-1/2 max-[640px]:w-full'>
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
              <Row className='mb-2 flex justify-end max-[400px]:mb-0 max-[400px]:flex-col-reverse max-[400px]:gap-4'>
                <Col className='my-0 w-1/4 max-[867px]:w-1/3 max-[640px]:w-1/2 max-[400px]:w-full'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => handleCancel(form)}
                    disabled={!form.formState.isDirty}
                  >
                    Hủy
                  </Button>
                </Col>
                <Col className='my-0 w-1/4 max-[867px]:w-1/3 max-[640px]:w-1/2 max-[400px]:w-full'>
                  <Button
                    type='submit'
                    variant='primary'
                    className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80'
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
