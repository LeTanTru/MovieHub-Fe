'use client';

import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { GENDER, GENDER_MALE, genderOptions } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useProfileMutation, useUploadImageMutation } from '@/queries';
import { updateProfileSchema } from '@/schemaValidations';
import { useAuthStore } from '@/store';
import { ProfileResType, UpdateProfileType } from '@/types';
import { notify } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function ProfileForm() {
  const { profile } = useAuthStore();
  const [avatarPath, setAvatarPath] = useState<string>(
    profile?.avatarPath || ''
  );
  const [isFormChanged, setIsFormChanged] = useState(false);
  const uploadImageMutation = useUploadImageMutation();
  const profileMutation = useProfileMutation();

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
    [profile]
  );

  useEffect(() => {
    if (profile) {
      setAvatarPath(profile.avatarPath || '');
    }
  }, [profile]);

  const onSubmit = async (values: UpdateProfileType) => {
    try {
      const response = await profileMutation.mutateAsync({
        ...values,
        avatarPath
      });
      if (response.result) {
        notify.success('Cập nhật thành công');
      }
      setIsFormChanged(false);
    } catch (error) {
      logger.error('Error while updating profile: ', error);
      notify.error('Cập nhật thất bại');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className='bg-background max-1120:mx-auto max-1120:mt-8 max-1120:w-[560px] max-1368:w-5/6 max-600:w-full relative w-2/3 rounded-lg'
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
          onChange={() => setIsFormChanged(true)}
        >
          {(form) => (
            <>
              <Row className='max-1120:mt-10 max-1120:items-center max-1120:gap-0 flex-col gap-2'>
                <Col className='max-1120:mb-4 max-1120:w-full mx-auto w-1/6'>
                  <UploadImageField
                    label='Ảnh đại diện'
                    value={avatarPath}
                    onChange={(url) => {
                      setAvatarPath(url);
                      setIsFormChanged(true);
                    }}
                    uploadImageFn={async (blob) => {
                      const response =
                        await uploadImageMutation.mutateAsync(blob);
                      return response.data?.filePath!;
                    }}
                    loading={uploadImageMutation.isPending}
                  />
                </Col>
                <Col>
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
                        className='text-sm'
                      />
                    </Col>
                  </Row>
                  <Row className='max-1120:mt-0 max-1120:flex-col max-1120:gap-4'>
                    <Col span={12} className='max-1120:w-full'>
                      <InputField
                        control={form.control}
                        name='username'
                        label='Tên đăng nhập'
                        required
                        placeholder='Nhập tên đăng nhập'
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
                      <AutoCompleteField
                        control={form.control}
                        options={genderOptions}
                        name='gender'
                        label='Giới tính'
                        required
                        getLabel={(opt) => opt.label}
                        getValue={(opt) => opt.value}
                        placeholder='Chọn giới tính'
                        onValueChange={() => setIsFormChanged(true)}
                        className='text-sm'
                      />
                    </Col>
                  </Row>
                  <div className='max-1120:mt-4 flex justify-end gap-2'>
                    <Button
                      type='submit'
                      className={cn('ml-2 w-32', {
                        'cursor-not-allowed opacity-50': !isFormChanged
                      })}
                    >
                      {profileMutation?.isPending ? (
                        <Loader2
                          className='size-6 animate-spin'
                          strokeWidth={2}
                        />
                      ) : (
                        'Cập nhật'
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </BaseForm>
      </motion.div>
    </AnimatePresence>
  );
}
