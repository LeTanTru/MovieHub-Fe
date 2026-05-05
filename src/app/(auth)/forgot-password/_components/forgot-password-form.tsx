'use client';

import type { UseFormReturn } from 'react-hook-form';
import Link from 'next/link';
import {
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema
} from '@/schemaValidations';
import { ForgotPasswordBodyType } from '@/types';
import { forgotPasswordErrorMaps, storageKeys } from '@/constants';
import { applyFormErrors, getData, notify, removeData, setData } from '@/utils';
import { BaseForm } from '@/components/form/base-form';
import { useEffect, useReducer, useState, useRef } from 'react';
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
import ForgotPasswordHeader from './header';
import StepOneFormSection from './step-one';
import StepTwoFormSection from './step-two';

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

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStepType>(1);
  const [
    { resendData, countdown, cooldownRemaining, lastResendTime },
    dispatch
  ] = useReducer(resendReducer, initialResendState);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const lastResendTimeRef = useRef(lastResendTime);

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
    lastResendTimeRef.current = lastResendTime;
  }, [lastResendTime]);

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
        lastResendTimeRef.current > 0
          ? COOLDOWN_TIME - (now - lastResendTimeRef.current)
          : 0;

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
  }, [resendData.count]);

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
          logger.error('[RESEND_OTP_ERROR]', error);
          notify.error('Gửi lại OTP thất bại');
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

  const handleClearForgotPassword = () => {
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
          logger.error('[SEND_OTP_ERROR]', error);
          notify.error('Gửi yêu cầu quên mật khẩu thất bại');
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
              handleClearForgotPassword();
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
            logger.error('[RESET_PASSWORD_ERROR]', error);
            notify.error('Đặt lại mật khẩu thất bại');
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

      <div className='mt-4 flex items-center justify-center text-center'>
        <Link
          href={route.login.path}
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
