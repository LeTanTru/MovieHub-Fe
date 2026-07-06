'use client';

import type { UseFormReturn } from 'react-hook-form';
import Link from 'next/link';
import {
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema
} from '@/schemaValidations';
import type { ForgotPasswordBodyType } from '@/types';
import { forgotPasswordErrorMaps, storageKeys } from '@/constants';
import {
  applyFormErrors,
  buildAuthPathWithRedirect,
  getData,
  notify,
  setData
} from '@/utils';
import { BaseForm } from '@/components/form/base-form';
import { useEffect, useState } from 'react';
import { logger } from '@/logger';
import {
  useForgotPasswordMutation,
  useRequestForgotPasswordMutation
} from '@/queries';
import { route } from '@/routes';
import { ArrowLeft } from 'lucide-react';
import { Activity } from '@/components/activity';
import { useNavigate, useQueryParams, useResendOtpTimer } from '@/hooks';
import { Separator } from '@/components/ui/separator';
import { ForgotPasswordHeader } from './header';
import { StepOneFormSection } from './step-one';
import { StepTwoFormSection } from './step-two';

type ForgotPasswordStepType = 1 | 2;

const defaultValues: ForgotPasswordBodyType = {
  email: '',
  otp: '',
  password: '',
  confirmPassword: ''
};

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const {
    searchParams: { redirect }
  } = useQueryParams<{ redirect?: string }>();
  const [step, setStep] = useState<ForgotPasswordStepType>(1);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const {
    resendCount,
    countdown,
    cooldownRemaining,
    isResendDisabled,
    resendOtpLoading,
    handleResendOtp,
    startCooldown,
    formatCountdown,
    clearTimerData
  } = useResendOtpTimer();

  const {
    mutate: requestForgotPassword,
    isPending: requestForgotPasswordLoading
  } = useRequestForgotPasswordMutation();

  const { mutate: forgotPassword, isPending: forgotPasswordLoading } =
    useForgotPasswordMutation();

  useEffect(() => {
    if (getData(storageKeys.EMAIL)) {
      setStep(2);
    }
  }, []);

  const handleBack = () => {
    clearTimerData();
    setStep(1);
  };

  const handleClearForgotPassword = () => {
    clearTimerData();
  };

  const onSubmit = (
    values: ForgotPasswordBodyType,
    form: UseFormReturn<ForgotPasswordBodyType>
  ) => {
    if (step === 1) {
      requestForgotPassword(values, {
        onSuccess: (res) => {
          setData(storageKeys.EMAIL, values.email);
          if (res.result) {
            notify.success('Mã OTP đã được gửi đến email của bạn');
            startCooldown();
            setStep(2);
          } else {
            const errorCode = res.code;
            if (errorCode) {
              const message = forgotPasswordErrorMaps[errorCode];
              if (message) {
                notify.error(message[0][1].message);
                applyFormErrors(form, errorCode, forgotPasswordErrorMaps);
              }
            } else {
              notify.error('Gửi yêu cầu quên mật khẩu thất bại');
            }
          }
        },
        onError: (error) => {
          logger.error('[SEND_OTP_ERROR]', error);
          notify.error('Gửi yêu cầu quên mật khẩu thất bại');
        }
      });
    } else if (step === 2) {
      forgotPassword(
        {
          ...values,
          email: getData(storageKeys.EMAIL)!
        },
        {
          onSuccess: (res) => {
            if (res.result) {
              notify.success('Đặt lại mật khẩu thành công');
              handleClearForgotPassword();
              navigate.push(
                buildAuthPathWithRedirect(route.login.path, redirect)
              );
            } else {
              const errorCode = res.code;
              if (errorCode) {
                const message = forgotPasswordErrorMaps[errorCode];
                if (message) notify.error(message[0][1].message);
                applyFormErrors(form, errorCode, forgotPasswordErrorMaps);
              } else {
                notify.error('Đặt lại mật khẩu thất bại');
              }
            }
          },
          onError: (error) => {
            logger.error('[RESET_PASSWORD_ERROR]', error);
            notify.error('Đặt lại mật khẩu thất bại');
          }
        }
      );
    }
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <ForgotPasswordHeader step={step} />

      <BaseForm
        schema={
          step === 1 ? forgotPasswordStep1Schema : forgotPasswordStep2Schema
        }
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        onChange={() => setIsFormChanged(true)}
        className='bg-transparent p-0'
      >
        {(form) => {
          return (
            <>
              <Activity visible={step === 1}>
                <StepOneFormSection
                  form={form}
                  loading={requestForgotPasswordLoading}
                  isFormChanged={isFormChanged}
                />
              </Activity>
              <Activity visible={step === 2}>
                <StepTwoFormSection
                  form={form}
                  resendDataCount={resendCount}
                  countdown={countdown}
                  cooldownRemaining={cooldownRemaining}
                  isResendDisabled={isResendDisabled}
                  resendOtpLoading={resendOtpLoading}
                  forgotPasswordLoading={forgotPasswordLoading}
                  onResendOtp={handleResendOtp}
                  onBack={handleBack}
                  formatCountdown={formatCountdown}
                />
              </Activity>
            </>
          );
        }}
      </BaseForm>

      <Separator
        orientation='horizontal'
        className='mt-4 h-[0.5px]! bg-gray-500'
      />

      <div className='mt-4 flex items-center justify-center text-center'>
        <Link
          href={buildAuthPathWithRedirect(route.login.path, redirect)}
          className='hover:text-golden-glow text-muted-foreground inline-flex items-center justify-center gap-2 transition-all duration-200 ease-linear'
          onClick={handleClearForgotPassword}
        >
          <ArrowLeft />
          Đăng nhập ngay
        </Link>
      </div>
    </section>
  );
}
