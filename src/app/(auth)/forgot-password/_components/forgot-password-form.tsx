'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  Button,
  Col,
  InputField,
  OtpInputField,
  PasswordField,
  Row
} from '@/components/form';
import Link from 'next/link';
import {
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema
} from '@/schemaValidations';
import { ForgotPasswordBodyType } from '@/types';
import { forgotPasswordErrorMaps, storageKeys } from '@/constants';
import { applyFormErrors, getData, notify, removeData, setData } from '@/utils';
import { BaseForm } from '@/components/form/base-form';
import { useEffect, useReducer, useState } from 'react';
import { logger } from '@/logger';
import {
  useForgotPasswordMutation,
  useRequestForgotPasswordMutation,
  useResendOtpMutation
} from '@/queries';
import { route } from '@/routes';
import { ArrowLeft } from 'lucide-react';
import { Activity } from '@/components/activity';
import { useNavigate } from '@/hooks';
import { Separator } from '@/components/ui/separator';

type ForgotPasswordStepType = 1 | 2;

const MAX_RESEND = 3; // RESEND LIMIT EACH 10 MINUTES
const RESEND_INTERVAL = 10 * 60 * 1000; // TIME TO RESEND AFTER REACH LIMIT
const COOLDOWN_TIME = 60 * 1000; // COOL DOWN BETWEEN EACH RESENDS

type ResendState = {
  resendData: {
    count: number;
    timestamp: number;
  };
  countdown: number;
  cooldownRemaining: number;
  lastResendTime: number;
};

type ResendAction =
  | {
      type: 'init';
      payload: {
        resendData: ResendState['resendData'];
        lastResendTime: number;
      };
    }
  | {
      type: 'tick';
      payload: {
        countdown: number;
        cooldownRemaining: number;
        resetResendData: boolean;
      };
    }
  | {
      type: 'set-last-resend-time';
      payload: number;
    }
  | {
      type: 'resend-success';
      payload: {
        count: number;
        timestamp: number;
      };
    };

const initialResendState: ResendState = {
  resendData: { count: 0, timestamp: 0 },
  countdown: 0,
  cooldownRemaining: 0,
  lastResendTime: 0
};

function resendReducer(state: ResendState, action: ResendAction): ResendState {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        resendData: action.payload.resendData,
        lastResendTime: action.payload.lastResendTime
      };
    case 'tick':
      return {
        ...state,
        countdown: action.payload.countdown,
        cooldownRemaining: action.payload.cooldownRemaining,
        resendData: action.payload.resetResendData
          ? { count: 0, timestamp: 0 }
          : state.resendData
      };
    case 'set-last-resend-time':
      return {
        ...state,
        lastResendTime: action.payload
      };
    case 'resend-success':
      return {
        ...state,
        resendData: {
          count: action.payload.count,
          timestamp: action.payload.timestamp
        },
        lastResendTime: action.payload.timestamp
      };
    default:
      return state;
  }
}

function ForgotPasswordHeader({ step }: { step: ForgotPasswordStepType }) {
  return (
    <div className='mb-4 flex flex-col items-center gap-2'>
      <h3 className='text-xl font-semibold'>Quên mật khẩu</h3>
      <Activity visible={step === 1}>
        <p className='text-muted-foreground text-center text-sm'>
          Nhập email để nhận mã OTP
        </p>
      </Activity>
      <Activity visible={step === 2}>
        <p className='text-muted-foreground text-center text-sm'>
          Nhập OTP đã được gửi đến email
        </p>
      </Activity>
    </div>
  );
}

function StepOneFormSection({
  form,
  loading,
  isFormChanged
}: {
  form: UseFormReturn<ForgotPasswordBodyType>;
  loading: boolean;
  isFormChanged: boolean;
}) {
  return (
    <Activity visible>
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
      <Row className='mb-0'>
        <Col className='grid-c-12'>
          <Button
            type='submit'
            variant='primary'
            className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80 w-full'
            disabled={loading || !isFormChanged}
            loading={loading}
          >
            Gửi yêu cầu
          </Button>
        </Col>
      </Row>
    </Activity>
  );
}

function StepTwoFormSection({
  form,
  resendDataCount,
  countdown,
  cooldownRemaining,
  isResendDisabled,
  resendOtpLoading,
  forgotPasswordLoading,
  onResendOtp,
  onBack,
  formatCountdown
}: {
  form: UseFormReturn<ForgotPasswordBodyType>;
  resendDataCount: number;
  countdown: number;
  cooldownRemaining: number;
  isResendDisabled: boolean;
  resendOtpLoading: boolean;
  forgotPasswordLoading: boolean;
  onResendOtp: () => void;
  onBack: () => void;
  formatCountdown: (ms: number) => string;
}) {
  return (
    <Activity visible>
      <Row className='mb-6'>
        <Col className='grid-c-12'>
          <OtpInputField
            name='otp'
            control={form.control}
            label='Nhập OTP'
            required
            description={
              <span className='mt-2 inline-block text-center'>
                Mã OTP đã được gửi đến email của bạn, <br /> có thời hạn sử dụng
                trong vòng 5 phút.
              </span>
            }
          />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col className='grid-c-12'>
          <span className='block text-center text-sm text-gray-500'>
            Số lần đã gửi: {resendDataCount} / {MAX_RESEND}
            {countdown > 0 && resendDataCount >= MAX_RESEND && (
              <>
                <br />
                Bạn có thể gửi lại sau: {formatCountdown(countdown)}
              </>
            )}
            {cooldownRemaining > 0 && (
              <>
                <br />
                Vui lòng đợi {Math.ceil(cooldownRemaining / 1000)} giây để gửi
                lại
              </>
            )}
          </span>
        </Col>
      </Row>
      <Row>
        <Col className='grid-c-12'>
          <Button
            type='button'
            variant='primary'
            className='mx-auto'
            onClick={onResendOtp}
            disabled={isResendDisabled}
            loading={resendOtpLoading}
          >
            Gửi lại OTP
          </Button>
        </Col>
      </Row>
      <Separator
        orientation='horizontal'
        className='mb-4 h-[0.5px]! bg-gray-500'
      />
      <Row>
        <Col className='grid-c-12'>
          <PasswordField
            name='password'
            control={form.control}
            label='Mật khẩu'
            placeholder='Nhập mật khẩu...'
            required
          />
        </Col>
      </Row>
      <Row>
        <Col className='grid-c-12'>
          <PasswordField
            name='confirmPassword'
            control={form.control}
            label='Nhập lại mật khẩu'
            placeholder='Nhập lại mật khẩu...'
            required
          />
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col className='grid-c-12'>
          <Button
            type='submit'
            variant='primary'
            className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80'
            disabled={forgotPasswordLoading || !form.formState.isValid}
            loading={forgotPasswordLoading}
          >
            Đặt lại mật khẩu
          </Button>
        </Col>
      </Row>
      <Row className='mb-0'>
        <Col className='grid-c-12'>
          <Button
            type='button'
            variant='secondary'
            onClick={onBack}
            className='dark:border-none'
          >
            Quay lại
          </Button>
        </Col>
      </Row>
    </Activity>
  );
}

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStepType>(2);
  const [
    { resendData, countdown, cooldownRemaining, lastResendTime },
    dispatch
  ] = useReducer(resendReducer, initialResendState);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const {
    mutateAsync: requestForgotPasswordMutate,
    isPending: requestForgotPasswordLoading
  } = useRequestForgotPasswordMutation();

  const {
    mutateAsync: forgotPasswordMutate,
    isPending: forgotPasswordLoading
  } = useForgotPasswordMutation();

  const { mutateAsync: resendOtpMutate, isPending: resendOtpLoading } =
    useResendOtpMutation();

  const defaultValues: ForgotPasswordBodyType = {
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  };

  useEffect(() => {
    let nextLastResendTime = 0;

    if (getData(storageKeys.EMAIL)) {
      setStep(2);
      // Load last resend time when returning to step 2
      const lastTime = getData(storageKeys.LAST_RESEND_TIME);
      if (lastTime) {
        nextLastResendTime = parseInt(lastTime);
      }
    }

    const lastTime = getData(storageKeys.LAST_RESEND_TIME);
    if (lastTime) {
      nextLastResendTime = parseInt(lastTime);
    }

    const resendRaw = getData(storageKeys.RESEND_OTP_TIME);
    const nextResendData = resendRaw
      ? JSON.parse(resendRaw)
      : { count: 0, timestamp: 0 };

    dispatch({
      type: 'init',
      payload: {
        resendData: nextResendData,
        lastResendTime: nextLastResendTime
      }
    });
  }, []);

  const getResendData = () => {
    const data = getData(storageKeys.RESEND_OTP_TIME);
    if (!data) return { count: 0, timestamp: 0 };
    return JSON.parse(data);
  };

  const setResendDataToLS = (count: number, timestamp: number) => {
    // count: store how many times which resend has been done
    // timestamp: store the time which resend has been done
    setData(storageKeys.RESEND_OTP_TIME, JSON.stringify({ count, timestamp }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const { timestamp } = getResendData();
      const remaining = RESEND_INTERVAL - (now - timestamp);
      const shouldResetResendData = remaining <= 0 && resendData.count > 0;

      if (shouldResetResendData) {
        setResendDataToLS(0, 0);
      }

      const cooldown =
        lastResendTime > 0 ? COOLDOWN_TIME - (now - lastResendTime) : 0;

      dispatch({
        type: 'tick',
        payload: {
          countdown: remaining > 0 ? remaining : 0,
          cooldownRemaining: cooldown > 0 ? cooldown : 0,
          resetResendData: shouldResetResendData
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendData.count, lastResendTime]);

  const handleResendOtp = async () => {
    const email = getData(storageKeys.EMAIL);
    if (!email) return;

    const now = Date.now();
    let { count, timestamp } = getResendData();

    if (cooldownRemaining > 0) {
      notify.error(
        `Vui lòng đợi ${Math.ceil(cooldownRemaining / 1000)} giây trước khi gửi lại`
      );
      return;
    }

    if (now - timestamp > RESEND_INTERVAL) {
      count = 0;
      timestamp = now;
    }

    if (count >= MAX_RESEND) {
      notify.error('Bạn đã gửi OTP quá 3 lần, vui lòng thử lại sau 10 phút');
      return;
    }

    await resendOtpMutate(
      { email },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Gửi lại OTP thành công');
            count += 1;
            timestamp = now;
            setResendDataToLS(count, timestamp);
            dispatch({
              type: 'resend-success',
              payload: { count, timestamp }
            });
            setData(storageKeys.LAST_RESEND_TIME, now.toString());
          } else {
            notify.error('Gửi lại OTP thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while resending OTP', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleBack = () => {
    removeData([storageKeys.RESEND_OTP_TIME, storageKeys.LAST_RESEND_TIME]);
    setStep(1);
  };

  const handleClearForgotPasswordData = () => {
    removeData([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
  };

  const onSubmit = async (
    values: ForgotPasswordBodyType,
    form: UseFormReturn<ForgotPasswordBodyType>
  ) => {
    if (step === 1) {
      await requestForgotPasswordMutate(values, {
        onSuccess: (res) => {
          setData(storageKeys.EMAIL, values.email);
          if (res.result) {
            notify.success('Mã OTP đã được gửi đến email của bạn');
            const now = Date.now();
            dispatch({ type: 'set-last-resend-time', payload: now });
            setData(storageKeys.LAST_RESEND_TIME, now.toString());
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
          logger.error('Error while sending otp: ', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      });
    } else if (step === 2) {
      await forgotPasswordMutate(
        {
          ...values,
          email: getData(storageKeys.EMAIL)!
        },
        {
          onSuccess: (res) => {
            if (res.result) {
              notify.success('Đặt lại mật khẩu thành công');
              handleClearForgotPasswordData();
              navigate.push(route.login.path);
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
            logger.error('Error while reseting password: ', error);
            notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
          }
        }
      );
    }
  };

  const isResendDisabled =
    (resendData.count >= MAX_RESEND && countdown > 0) || cooldownRemaining > 0;

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
                  resendDataCount={resendData.count}
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

      <div className='text-muted-foreground mt-4 text-center text-sm'>
        <Link
          href={route.login.path}
          className='hover:text-golden-glow flex items-center justify-center gap-x-2 transition-all duration-200 ease-linear'
          onClick={handleClearForgotPasswordData}
        >
          <ArrowLeft />
          Đăng nhập ngay
        </Link>
      </div>
    </section>
  );
}
