'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button, CheckboxField, Col, InputField, Row } from '@/components/form';
import PasswordField from '@/components/form/password-field';
import Link from 'next/link';
import { registerSchema } from '@/schemaValidations';
import { RegisterType } from '@/types';
import { registerErrorMaps } from '@/constants';
import { applyFormErrors, notify } from '@/utils';
import { useAuthDialogStore } from '@/store';
import { BaseForm } from '@/components/form/base-form';
import { useState } from 'react';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useRegisterMutation } from '@/queries';
import ButtonLoading from '@/components/loading/button-loading';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { setOpen, setMode } = useAuthDialogStore();
  const defaultValues: RegisterType = {
    email: '',
    fullName: '',
    password: '',
    terms: false
  };
  const [isFormChanged, setIsFormChanged] = useState(false);
  const registerMutation = useRegisterMutation();

  const onSubmit = async (
    values: RegisterType,
    form: UseFormReturn<RegisterType>
  ) => {
    try {
      const response = await registerMutation.mutateAsync(values);
      if (!response?.result && response.code) {
        applyFormErrors(form, response.code, registerErrorMaps);
      } else {
        notify.success('Đăng ký thành công');
        setOpen(false);
        setTimeout(() => {
          setOpen(true);
          setMode('login');
        }, 300);
      }
    } catch (error) {
      logger.error('Error during registration:', error);
    }
  };

  return (
    <>
      <div className='mb-5 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Đăng ký</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi.
        </p>
      </div>

      <BaseForm
        schema={registerSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
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
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  name='fullName'
                  label='Họ và tên'
                  placeholder='Nhập họ và tên của bạn'
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
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CheckboxField
                  control={form.control}
                  name='terms'
                  label={
                    <span>
                      Tôi đồng ý với{' '}
                      <Link href='/terms' className='text-primary underline'>
                        các điều khoản và điều kiện
                      </Link>
                    </span>
                  }
                />
              </Col>
            </Row>
            <Button
              type='submit'
              className={cn('w-full', {
                'cursor-not-allowed opacity-50': !isFormChanged
              })}
            >
              {registerMutation.isPending ? <ButtonLoading /> : 'Đăng ký'}
            </Button>
          </>
        )}
      </BaseForm>

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-1 text-center text-sm'>
        Đã có tài khoản?
        <Button
          type='button'
          variant='link'
          className='text-primary p-0 pl-1'
          onClick={onSwitch}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </>
  );
}
