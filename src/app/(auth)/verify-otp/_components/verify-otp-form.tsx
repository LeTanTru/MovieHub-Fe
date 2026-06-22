'use client';

import { Button, Col, OtpInputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Separator } from '@/components/ui/separator';
import {
  REDIRECT_AFTER_LOGIN_DURATION,
  storageKeys,
  verifyOtpErrorMaps
} from '@/constants';
import { useNavigate, useQueryParams, useResendOtpTimer } from '@/hooks';
import { logger } from '@/logger';
import { useVerifyOtpMutation } from '@/queries';
import { route } from '@/routes';
import { otpSchema } from '@/schemaValidations';
import { VerifyOtpBodyType } from '@/types';
import {
  applyFormErrors,
  buildAuthPathWithRedirect,
  getData,
  notify
} from '@/utils';
import { useEffect, useMemo, useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

const MAX_RESEND = 3;

const defaultValues: VerifyOtpBodyType = {
  email: '',
  otp: ''
};

export function VerifyOtpForm() {
  const navigate = useNavigate();
  const {
    searchParams: { redirect }
  } = useQueryParams<{ redirect?: string }>();
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const navigateRef = useRef(navigate);
  const missingEmailNotifiedRef = useRef(false);

  const {
    resendCount,
    countdown,
    cooldownRemaining,
    isResendDisabled,
    resendOtpLoading,
    handleResendOtp,
    formatCountdown,
    clearTimerData
  } = useResendOtpTimer();

  const { mutate: verifyOtp, isPending } = useVerifyOtpMutation();
  const email = getData(storageKeys.EMAIL) ?? '';

  const initialValues: VerifyOtpBodyType = useMemo(
    () => ({
      ...defaultValues,
      email
    }),
    [email]
  );

  const registerPath = buildAuthPathWithRedirect(route.register.path, redirect);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    if (email) return;

    if (!missingEmailNotifiedRef.current) {
      notify.error('Vui lòng đăng ký trước khi xác thực OTP');
      missingEmailNotifiedRef.current = true;
    }

    const timeout = setTimeout(() => {
      navigateRef.current.replace(registerPath);
    }, REDIRECT_AFTER_LOGIN_DURATION);

    return () => clearTimeout(timeout);
  }, [email, registerPath]);

  const handleBack = () => {
    clearTimerData();
    navigate.push(registerPath);
  };

  const onSubmit = (
    values: VerifyOtpBodyType,
    form: UseFormReturn<VerifyOtpBodyType>
  ) => {
    verifyOtp(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xác thực OTP thành công');
          clearTimerData();
          navigate.push(buildAuthPathWithRedirect(route.login.path, redirect));
        } else {
          const errorCode = res.code;
          if (errorCode) {
            const message = verifyOtpErrorMaps[errorCode];
            if (message) {
              notify.error(message[0][1].message);
              applyFormErrors(form, errorCode, verifyOtpErrorMaps);
            }
          } else {
            notify.error('Xác thực OTP thất bại');
          }
        }
      },
      onError: (error) => {
        logger.error('[VERIFY_OTP_ERROR]', error);
        notify.error('Xác thực OTP thất bại');
      }
    });
  };

  return (
    <section className='bg-vintage-blue max-520:px-4 rounded-lg p-4'>
      <div className='mb-4 flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Xác thực email</h2>
        <p className='text-muted-foreground text-center text-sm'>
          Nhập OTP đã được gửi đến email để hoàn thành đăng ký
        </p>
      </div>

      <BaseForm
        schema={otpSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        initialValues={initialValues}
        onChange={() => setIsFormChanged(true)}
        className='bg-transparent p-0'
      >
        {(form) => (
          <>
            <Row>
              <Col className='grid-c-12'>
                <OtpInputField
                  name='otp'
                  control={form.control}
                  label='Nhập OTP'
                  required
                  description={
                    <>
                      <span className='mt-2 inline-block text-center'>
                        Mã OTP đã được gửi đến email của bạn, <br /> có thời hạn
                        sử dụng trong vòng 5 phút.
                      </span>
                    </>
                  }
                />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col className='grid-c-12'>
                <span className='block text-center text-sm text-gray-300'>
                  Số lần đã gửi: {resendCount} / {MAX_RESEND}
                  {countdown > 0 && resendCount >= MAX_RESEND && (
                    <>
                      <br />
                      Bạn có thể gửi lại sau: {formatCountdown(countdown)}
                    </>
                  )}
                  {cooldownRemaining > 0 && (
                    <>
                      <br />
                      Vui lòng đợi {Math.ceil(cooldownRemaining / 1000)} giây để
                      gửi lại
                    </>
                  )}
                </span>
              </Col>
            </Row>
            <Row>
              <Col className='grid-c-12'>
                <Button
                  type='button'
                  className='mx-auto'
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  loading={resendOtpLoading}
                  variant='primary'
                >
                  Gửi lại OTP
                </Button>
              </Col>
            </Row>

            <Separator
              orientation='horizontal'
              className='my-4 h-[0.5px]! bg-gray-500'
            />

            <Row className='mb-4'>
              <Col className='grid-c-12'>
                <Button
                  type='submit'
                  variant='primary'
                  className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
                  disabled={isPending || !isFormChanged}
                  loading={isPending}
                >
                  Xác thực OTP
                </Button>
              </Col>
            </Row>
            <Row className='mb-0'>
              <Col className='grid-c-12'>
                <Button type='button' variant='secondary' onClick={handleBack}>
                  Quay lại
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
    </section>
  );
}
