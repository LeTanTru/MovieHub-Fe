'use client';

import { Button, Col, InputField, PasswordField, Row } from '@/components/form';
import { LoginBodyType, LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';
import {
  notify,
  removeData,
  setAccessTokenToLocalStorage,
  setData,
  setRefreshTokenToLocalStorage
} from '@/utils';
import { storageKeys } from '@/constants';
import { useAuthStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import Link from 'next/link';
import { useState } from 'react';
import { logger } from '@/logger';
import { useLoginMutation, useProfileQuery } from '@/queries';
import ButtonLoginGoogle from './button-login-google';
import { route } from '@/routes';

export default function LoginForm() {
  const { refetch: getProfile } = useProfileQuery();
  const { mutateAsync: loginMutate, isPending: loginLoading } =
    useLoginMutation();
  const setProfile = useAuthStore((s) => s.setProfile);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const defaultValues: LoginType = {
    email: '',
    password: ''
  };

  const onSubmit = async (values: LoginBodyType) => {
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
        window.location.href = route.home.path;
      } else {
        notify.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      logger.error('Login failed', error);
    }
  };

  const handleClearForgotPasswordData = () => {
    removeData(storageKeys.EMAIL);
    removeData(storageKeys.RESEND_OTP_TIME);
    removeData(storageKeys.LAST_RESEND_TIME);
  };

  return (
    <section className='rounded-lg bg-slate-800/40 px-6 py-4'>
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
        className='p-0'
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
                <div className='text-muted-foreground text-right text-sm transition-all duration-200 ease-linear hover:text-white'>
                  <Link
                    onClick={handleClearForgotPasswordData}
                    href={route.forgotPassword.path}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </Col>
            </Row>

            <Button
              type='submit'
              variant='primary'
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

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        Chưa có tài khoản? &nbsp;
        <Link
          href={route.register.path}
          className='transition-all duration-200 ease-linear hover:text-white'
        >
          Đăng ký ngay
        </Link>
      </div>
    </section>
  );
}
