'use client';

import { Button, Col, InputField, PasswordField, Row } from '@/components/form';
import { LoginBodyType, LoginType } from '@/types';
import { loginSchema } from '@/schemaValidations';
import {
  buildAuthPathWithRedirect,
  getSafeRedirectPath,
  notify,
  removeData
} from '@/utils';
import { REDIRECT_AFTER_LOGIN_DURATION, storageKeys } from '@/constants';
import { useAuthStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import Link from 'next/link';
import { useState } from 'react';
import { useLoginMutation } from '@/queries';
import { ButtonLoginGoogle } from './button-login-google';
import { route } from '@/routes';
import { Separator } from '@/components/ui/separator';
import { useShallow } from 'zustand/shallow';
import { useQueryParams } from '@/hooks';

const defaultValues: LoginType = {
  email: '',
  password: ''
};

export function LoginForm() {
  const {
    searchParams: { redirect }
  } = useQueryParams<{ redirect?: string }>();

  const { mutate: loginMutate, isPending: loginLoading } = useLoginMutation();

  const { setAccessToken, setUserKind } = useAuthStore(
    useShallow((s) => {
      return {
        setAccessToken: s.setAccessToken,
        setUserKind: s.setUserKind
      };
    })
  );

  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const onSubmit = (values: LoginBodyType) => {
    loginMutate(values, {
      onSuccess: async (res) => {
        if (res.result) {
          const accessToken = res.data?.access_token;
          const userKind = res.data?.user_kind;

          setAccessToken(accessToken as string);
          setUserKind(userKind as number);

          notify.success('Đăng nhập thành công');

          setTimeout(() => {
            if (redirect) {
              window.location.href = getSafeRedirectPath(
                redirect,
                window.location.origin,
                route.home.path
              );
            } else {
              window.location.reload();
            }
          }, REDIRECT_AFTER_LOGIN_DURATION);
        }
      },
      onError: () => {
        notify.error('Email hoặc mật khẩu không đúng');
      }
    });
  };

  const handleClearForgotPasswordData = () => {
    removeData([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <div className='mb-4 flex flex-col items-center gap-2'>
        <h3 className='text-xl font-semibold'>Đăng nhập</h3>
        <p className='text-muted-foreground max-420:hidden text-center'>
          Đăng nhập để có trải nghiệm tốt nhất với MovieHub
        </p>
      </div>

      <BaseForm
        schema={loginSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onChange={() => setIsFormChanged(true)}
        className='bg-transparent p-0'
      >
        {(form) => (
          <>
            <Row>
              <Col className='grid-c-12'>
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
              <Col className='grid-c-12'>
                <PasswordField
                  control={form.control}
                  name='password'
                  label='Mật khẩu'
                  placeholder='Nhập mật khẩu của bạn'
                  required
                />
              </Col>
            </Row>

            <Button
              type='submit'
              variant='primary'
              className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80 w-full'
              disabled={!isFormChanged || loginLoading}
              loading={loginLoading}
            >
              Đăng nhập
            </Button>

            <Row className='my-4'>
              <Col className='grid-c-12'>
                <div className='text-right'>
                  <Link
                    onClick={handleClearForgotPasswordData}
                    href={buildAuthPathWithRedirect(
                      route.forgotPassword.path,
                      redirect
                    )}
                    className='text-muted-foreground hover:text-golden-glow transition-all duration-200 ease-linear'
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>

      <div className='my-4 flex items-center gap-3'>
        <div className='bg-border h-px flex-1'></div>
        <span className='text-muted-foreground'>Hoặc</span>
        <div className='bg-border h-px flex-1'></div>
      </div>

      <Row className='mb-4'>
        <Col className='grid-c-12'>
          <ButtonLoginGoogle />
        </Col>
      </Row>

      <Separator orientation='horizontal' className='h-[0.5px]! bg-gray-500' />

      <div className='text-muted-foreground mt-4 text-center'>
        Chưa có tài khoản ? &nbsp;
        <Link
          href={buildAuthPathWithRedirect(route.register.path, redirect)}
          className='hover:text-golden-glow transition-all duration-200 ease-linear'
        >
          Đăng ký ngay
        </Link>
      </div>
    </section>
  );
}
