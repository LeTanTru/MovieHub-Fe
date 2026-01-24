'use client';

import { Button, Col, InputField, PasswordField, Row } from '@/components/form';
import { LoginBodyType, LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';
import {
  notify,
  setAccessTokenToLocalStorage,
  setData,
  setRefreshTokenToLocalStorage
} from '@/utils';
import { storageKeys } from '@/constants';
import { useAuthDialogStore, useAuthStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import Link from 'next/link';
import { useState } from 'react';
import { logger } from '@/logger';
import { useLoginMutation, useProfileQuery } from '@/queries';
import ButtonLoginGoogle from './button-login-google';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { refetch: getProfile } = useProfileQuery();
  const { mutateAsync: loginMutate, isPending: loginLoading } =
    useLoginMutation();
  const setProfile = useAuthStore((s) => s.setProfile);
  const setOpen = useAuthDialogStore((s) => s.setOpen);
  const setIsSubmitting = useAuthDialogStore((s) => s.setIsSubmitting);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const defaultValues: LoginType = {
    email: 'dopaminee1311@gmail.com',
    password: 'Abc@1234'
  };

  const onSubmit = async (values: LoginBodyType) => {
    setIsSubmitting(true);
    try {
      const res = await loginMutate(values);
      if (res.result) {
        setAccessTokenToLocalStorage(res.access_token);
        setRefreshTokenToLocalStorage(res.refresh_token);
        setData(storageKeys.USER_KIND, String(res.user_kind));
        notify.success('Đăng nhập thành công');
        const profile = await getProfile();
        if (profile.data?.data) {
          setProfile(profile.data?.data);
        }
        setOpen(false);
      } else {
        notify.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      logger.error('Login failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='mb-5 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Đăng nhập</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Đăng nhập để có trải nghiệm tốt nhất với MovieHub
        </p>
      </div>

      <BaseForm
        schema={loginSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onChange={() => setIsFormChanged(true)}
        className='bg-transparent'
      >
        {(form) => (
          <>
            <Row>
              <Col span={24}>
                <InputField
                  control={form.control}
                  name='email'
                  label='Email'
                  placeholder='Nhập email của bạn'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <PasswordField
                  control={form.control}
                  name='password'
                  label='Mật khẩu'
                  placeholder='Nhập mật khẩu của bạn'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className='flex items-center justify-end text-sm'>
                  <Link href='#' className='underline hover:no-underline'>
                    Quên mật khẩu?
                  </Link>
                </div>
              </Col>
            </Row>

            <Button
              type='submit'
              className='w-full'
              disabled={!isFormChanged || loginLoading}
              loading={loginLoading}
            >
              Đăng nhập
            </Button>
          </>
        )}
      </BaseForm>

      <div className='my-4 flex items-center gap-3'>
        <div className='bg-border h-px flex-1'></div>
        <span className='text-muted-foreground text-sm'>Hoặc</span>
        <div className='bg-border h-px flex-1'></div>
      </div>

      <ButtonLoginGoogle />

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-1 text-center text-sm'>
        Chưa có tài khoản?
        <Button
          type='button'
          variant='link'
          className='text-primary p-0 pl-1'
          onClick={onSwitch}
        >
          Đăng ký ngay
        </Button>
      </div>
    </>
  );
}
