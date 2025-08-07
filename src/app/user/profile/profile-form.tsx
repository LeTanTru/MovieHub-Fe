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
import { GENDER, genderOptions } from '@/constants';
import { GENDER_MALE } from '@/constants/constant';
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
        className='bg-background relative w-full max-w-2xl rounded-lg p-6'
      >
        <BaseForm
          schema={updateProfileSchema}
          initialValues={initialValues}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onChange={() => setIsFormChanged(true)}
        >
          {(form) => (
            <>
              <UploadImageField
                label='Ảnh đại diện'
                value={avatarPath}
                onChange={(url) => {
                  setAvatarPath(url);
                  setIsFormChanged(true);
                }}
                uploadImageFn={async (blob) => {
                  const response = await uploadImageMutation.mutateAsync(blob);
                  return response.data?.filePath!;
                }}
              />
              <Row>
                <Col>
                  <InputField
                    control={form.control}
                    name='fullName'
                    label='Họ và tên'
                    required
                    placeholder='Nhập họ và tên'
                  />
                </Col>
                <Col>
                  <InputField
                    control={form.control}
                    name='email'
                    label='Email'
                    required
                    placeholder='Nhập email'
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputField
                    control={form.control}
                    name='username'
                    label='Tên đăng nhập'
                    required
                    placeholder='Nhập tên đăng nhập'
                  />
                </Col>
                <Col>
                  <AutoCompleteField
                    control={form.control}
                    options={genderOptions}
                    name='gender'
                    label='Giới tính'
                    required
                    getLabel={(opt) => opt.label}
                    getValue={(opt) => opt.value}
                    placeholder='Chọn giới tính'
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputField
                    control={form.control}
                    name='phone'
                    label='Số điện thoại'
                    required
                    placeholder='Nhập số điện thoại'
                  />
                </Col>
              </Row>
              <div className='mt-6 flex justify-end gap-2'>
                <Button
                  type='submit'
                  className={cn('ml-2 w-32', {
                    'cursor-not-allowed opacity-50': !isFormChanged
                  })}
                >
                  {profileMutation?.isPending ? (
                    <Loader2 className='size-6 animate-spin' strokeWidth={3} />
                  ) : (
                    'Cập nhật'
                  )}
                </Button>
              </div>
            </>
          )}
        </BaseForm>
      </motion.div>
    </AnimatePresence>
  );
}
