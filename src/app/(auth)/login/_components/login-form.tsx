'use client';

import { Button, Col, InputField, PasswordField, Row } from '@/components/form';
import { LoginBodyType, LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';
import { notify, removeDatas, setMultipleData } from '@/utils';
import { storageKeys } from '@/constants';
import { useAuthStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import Link from 'next/link';
import { useState } from 'react';
import { logger } from '@/logger';
import {
  useLoginMutation,
  useProfileQuery,
  useSetCookieServerMutation
} from '@/queries';
import ButtonLoginGoogle from './button-login-google';
import { route } from '@/routes';
import { Separator } from '@/components/ui/separator';

export default function LoginForm() {
  const { refetch: getProfile } = useProfileQuery();
  const { mutateAsync: loginMutate, isPending: loginLoading } =
    useLoginMutation();

  const {
    mutateAsync: setCookieServerMutate,
    isPending: setCookieServerLoading
  } = useSetCookieServerMutation();

  const setProfile = useAuthStore((s) => s.setProfile);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const defaultValues: LoginType = {
    email: '',
    password: ''
  };

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const res = await loginMutate(values);
      if (res.access_token) {
        setMultipleData({
          [storageKeys.ACCESS_TOKEN]: res.access_token,
          [storageKeys.REFRESH_TOKEN]: res.refresh_token,
          [storageKeys.USER_KIND]: String(res.user_kind)
        });
        await setCookieServerMutate(res);
        notify.success('Đăng nhập thành công');
        const profile = await getProfile();
        if (profile.data?.data) {
          setProfile(profile.data?.data);
        }
        setTimeout(() => {
          window.location.href = route.home.path;
        }, 500);
      } else {
        notify.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      logger.error('Error while logging in', error);
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  const handleClearForgotPasswordData = () => {
    removeDatas([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
  };

  return (
    <section className='bg-auth-form rounded-lg px-6 py-4'>
      <div className='mb-4 flex flex-col items-center gap-2'>
        <h3 className='text-xl font-semibold'>Đăng nhập</h3>
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
                <div className='text-muted-foreground hover:text-light-golden-yellow text-right text-sm transition-all duration-200 ease-linear'>
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
              className='dark:bg-light-golden-yellow dark:hover:bg-light-golden-yellow/80 dark:disabled:bg-light-golden-yellow/80 dark:disabled:hover:bg-light-golden-yellow/80 w-full'
              disabled={
                !isFormChanged || loginLoading || setCookieServerLoading
              }
              loading={loginLoading || setCookieServerLoading}
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

      <Separator
        orientation='horizontal'
        className='mt-4 h-[0.5px]! bg-gray-500'
      />

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        Chưa có tài khoản? &nbsp;
        <Link
          href={route.register.path}
          className='hover:text-light-golden-yellow transition-all duration-200 ease-linear'
        >
          Đăng ký ngay
        </Link>
      </div>
    </section>
  );
}
