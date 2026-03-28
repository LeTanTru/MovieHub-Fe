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
import { Separator } from '@/components/ui/separator';

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
        navigate.push(route.verifyOtp.path);
      } else {
        const errorCode = res.code;
        if (errorCode) {
          const message = registerErrorMaps[errorCode];
          if (message) notify.error(message[0][1].message);
          applyFormErrors(form, errorCode, registerErrorMaps);
        } else {
          notify.error('Đăng ký thất bại');
        }
      }
    } catch (error) {
      logger.error('Error while registering', error);
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <div className='mb-4 flex flex-col items-center gap-2'>
        <h3 className='text-xl font-semibold'>Đăng ký</h3>
        <p className='text-muted-foreground max-420:hidden text-center text-sm'>
          Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi.
        </p>
      </div>

      <BaseForm
        schema={registerSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
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
            <Row>
              <Col className='grid-c-12'>
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
              <Col className='grid-c-12'>
                <CheckboxField
                  control={form.control}
                  name='terms'
                  label={
                    <span>
                      Tôi đồng ý với{' '}
                      <Link href='/terms' className='underline'>
                        các điều khoản và điều kiện
                      </Link>
                    </span>
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col className='grid-c-12'>
                <Button
                  type='submit'
                  variant='primary'
                  className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/50 dark:disabled:hover:bg-golden-glow/50 w-full'
                  disabled={registerLoading || !isFormChanged}
                  loading={registerLoading}
                >
                  Đăng ký
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>

      <Separator
        orientation='horizontal'
        className='mt-4 h-[0.5px]! bg-gray-500'
      />

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        Đã có tài khoản?&nbsp;
        <Link
          href={route.login.path}
          className='hover:text-golden-glow transition-all duration-200 ease-linear'
        >
          Đăng nhập ngay
        </Link>
      </div>
    </section>
  );
}
