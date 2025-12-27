'use client';

import { Button, Col, InputField, Row } from '@/components/form';
import ButtonLoginGoogle from '@/components/app/auth/login/button-login-google';
import { LoginBodyType, LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';
import { notify, setAccessTokenToLocalStorage, setData } from '@/utils';
import { storageKeys } from '@/constants';
import { useAuthDialogStore, useAuthStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import PasswordField from '@/components/form/password-field';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLoginMutation } from '@/queries';
import { CircleLoading } from '@/components/loading';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const loginMutation = useLoginMutation();
  const authDialogStore = useAuthDialogStore();
  const authStore = useAuthStore();
  const [isFormChanged, setIsFormChanged] = useState(false);

  const defaultValues: LoginType = {
    email: 'dopamine@gmail.com',
    password: 'Abc@1234'
  };

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      if (response.result !== undefined && response.result === false) {
        notify.error('Email hoặc mật khẩu không đúng');
      } else {
        const accessToken = response.access_token;
        const userKind = response.user_kind;
        setAccessTokenToLocalStorage(accessToken);

        setData(storageKeys.USER_KIND, String(userKind));
        notify.success('Đăng nhập thành công');
        authDialogStore.setOpen(false);
        setTimeout(() => {
          authStore.setAuthenticated(true);
        }, 100);
      }
    } catch (error) {
      logger.error('Login failed:', error);
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
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  name='email'
                  label='Email'
                  placeholder='Nhập email của bạn'
                  type='text'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <PasswordField
                  control={form.control}
                  name='password'
                  label='Mật khẩu'
                  placeholder='Nhập mật khẩu của bạn'
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='flex items-center justify-end text-sm'>
                  <Link href='#' className='underline hover:no-underline'>
                    Quên mật khẩu?
                  </Link>
                </div>
              </Col>
            </Row>

            <Button
              type='submit'
              className={cn('w-full', {
                'cursor-not-allowed opacity-50': !isFormChanged
              })}
            >
              {loginMutation.isPending ? (
                <CircleLoading className='stroke-slate-500' />
              ) : (
                'Đăng nhập'
              )}
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
