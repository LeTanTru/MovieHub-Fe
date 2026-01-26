'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button, Col, InputField, Row } from '@/components/form';
import Link from 'next/link';
import { registerSchema } from '@/schemaValidations';
import { ForgotPasswordBodyType, RegisterType } from '@/types';
import { registerErrorMaps } from '@/constants';
import { applyFormErrors, notify } from '@/utils';
import { BaseForm } from '@/components/form/base-form';
import { useState } from 'react';
import { logger } from '@/logger';
import { useRegisterMutation } from '@/queries';
import { route } from '@/routes';
import { ArrowLeft } from 'lucide-react';

type ForgotPasswordStepType = 1 | 2;

const MAX_RESEND = 3;
const RESEND_INTERVAL = 10 * 60 * 1000;

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<ForgotPasswordStepType>(1);
  const [resendData, setResendDataState] = useState<{
    count: number;
    timestamp: number;
  }>({ count: 0, timestamp: 0 });

  const [countdown, setCountdown] = useState(0);
  const defaultValues: ForgotPasswordBodyType = {
    email: '',
    fullName: '',
    password: '',
    terms: false
  };
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { mutateAsync: registerMutate, isPending: registerLoading } =
    useRegisterMutation();

  const onSubmit = async (
    values: RegisterType,
    form: UseFormReturn<RegisterType>
  ) => {
    try {
      const res = await registerMutate(values);
      if (!res?.result && res.code) {
        applyFormErrors(form, res.code, registerErrorMaps);
      } else {
        notify.success('Đăng ký thành công');
      }
    } catch (error) {
      logger.error('Error while registering', error);
    }
  };

  return (
    <section className='rounded-lg bg-slate-800/40 px-6 py-4'>
      <div className='mb-5 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Quên mật khẩu</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Nhập email tài khoản để yêu cầu mật khẩu mới.
        </p>
      </div>

      <BaseForm
        schema={registerSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        onChange={() => setIsFormChanged(true)}
        className='bg-transparent px-0'
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
            <Button
              type='submit'
              className='w-full'
              disabled={registerLoading || !isFormChanged}
              loading={registerLoading}
            >
              Gửi yêu cầu
            </Button>
          </>
        )}
      </BaseForm>

      <div className='bg-accent mt-4 h-px w-full'></div>

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        <Link
          href={route.login.path}
          className='flex items-center justify-center gap-x-2 transition-all duration-200 ease-linear hover:text-white'
        >
          <ArrowLeft />
          Đăng nhập ngay
        </Link>
      </div>
    </section>
  );
}
