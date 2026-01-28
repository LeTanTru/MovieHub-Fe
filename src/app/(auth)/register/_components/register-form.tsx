'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  Button,
  CheckboxField,
  Col,
  InputField,
  PasswordField,
  Row
} from '@/components/form';
import Link from 'next/link';
import { registerSchema } from '@/schemaValidations';
import { RegisterType } from '@/types';
import { registerErrorMaps, storageKeys } from '@/constants';
import { applyFormErrors, notify, setData } from '@/utils';
import { BaseForm } from '@/components/form/base-form';
import { useState } from 'react';
import { logger } from '@/logger';
import { useRegisterMutation } from '@/queries';
import { route } from '@/routes';
import { useNavigate } from '@/hooks';

export default function RegisterForm() {
  const navigate = useNavigate();
  const defaultValues: RegisterType = {
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    terms: false
  };
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const { mutateAsync: registerMutate, isPending: registerLoading } =
    useRegisterMutation();

  const onSubmit = async (
    values: RegisterType,
    form: UseFormReturn<RegisterType>
  ) => {
    try {
      const res = await registerMutate(values);
      if (res.result) {
        notify.success('Đăng ký thành công');
        setData(storageKeys.EMAIL, values.email);
        navigate(route.verifyOtp.path);
      } else {
        const errorCode = res.code;
        if (errorCode) {
          const message = registerErrorMaps[errorCode];
          if (message) notify.error(message[0][1].message);
          applyFormErrors(form, errorCode, registerErrorMaps);
        }
      }
    } catch (error) {
      logger.error('Error while registering', error);
    }
  };

  return (
    <section className='rounded-lg bg-slate-800/40 px-6 py-4'>
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
                <PasswordField
                  control={form.control}
                  name='confirmPassword'
                  label='Nhập lại mật khẩu'
                  placeholder='Nhập lại mật khẩu'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
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
              variant='primary'
              className='w-full'
              disabled={registerLoading || !isFormChanged}
              loading={registerLoading}
            >
              Đăng ký
            </Button>
          </>
        )}
      </BaseForm>

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        Đã có tài khoản? &nbsp;
        <Link
          href={route.login.path}
          className='transition-all duration-200 ease-linear hover:text-white'
        >
          Đăng nhập ngay
        </Link>
      </div>
    </section>
  );
}
