'use client';
import { Button, Col, OtpInputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { Separator } from '@/components/ui/separator';
import { storageKeys, verifyOtpErrorMaps } from '@/constants';
import { useNavigate } from '@/hooks';
import { logger } from '@/logger';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/queries';
import { route } from '@/routes';
import { otpSchema } from '@/schemaValidations';
import { VerifyOtpBodyType } from '@/types';
import { applyFormErrors, getData, notify, removeData, setData } from '@/utils';
import { useEffect, useReducer, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

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

export default function VerifyOtpForm() {
  const navigate = useNavigate();

  const [
    { resendData, countdown, cooldownRemaining, lastResendTime },
    dispatch
  ] = useReducer(resendReducer, initialResendState);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const { mutateAsync: resendOtpMutate, isPending: resendOtpLoading } =
    useResendOtpMutation();
  const { mutateAsync: verifyOtpMutate, isPending: verifyOtpLoading } =
    useVerifyOtpMutation();

  const defaultValues: VerifyOtpBodyType = {
    email: getData(storageKeys.EMAIL) ?? '',
    otp: ''
  };

  const getResendData = () => {
    const data = getData(storageKeys.RESEND_OTP_TIME);
    if (!data) return { count: 0, timestamp: 0 };
    return JSON.parse(data);
  };

  useEffect(() => {
    const lastTime = getData(storageKeys.LAST_RESEND_TIME);
    const now = Date.now();
    const resolvedLastResendTime = lastTime ? parseInt(lastTime) : now;

    if (!lastTime) {
      setData(storageKeys.LAST_RESEND_TIME, now.toString());
    }

    dispatch({
      type: 'init',
      payload: {
        resendData: getResendData(),
        lastResendTime: resolvedLastResendTime
      }
    });
  }, []);

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

  const handleClearData = () => {
    removeData([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
  };

  const handleBack = () => {
    handleClearData();
    navigate.push(route.register.path);
  };

  const onSubmit = async (
    values: VerifyOtpBodyType,
    form: UseFormReturn<VerifyOtpBodyType>
  ) => {
    await verifyOtpMutate(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xác thực OTP thành công');
          removeData(storageKeys.EMAIL);
          handleClearData();
          navigate.push(route.login.path);
        } else {
          const errorCode = res.code;
          if (errorCode) {
            const message = verifyOtpErrorMaps[errorCode];
            if (message) {
              notify.error(message[0][1].message);
              applyFormErrors(form, errorCode, verifyOtpErrorMaps);
            }
          } else {
            notify.error('Có lỗi xảy ra khi gửi OTP');
          }
        }
      },
      onError: (error) => {
        logger.error('Error while verifying otp: ', error);
        notify.error('Có lỗi xảy ra khi xác thực OTP');
      }
    });
  };

  const isResendDisabled =
    (resendData.count >= MAX_RESEND && countdown > 0) || cooldownRemaining > 0;

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
                  Số lần đã gửi: {resendData.count} / {MAX_RESEND}
                  {countdown > 0 && resendData.count >= MAX_RESEND && (
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
                  className='dark:bg-golden-glow dark:hover:bg-golden-glow/80 dark:disabled:bg-golden-glow/80 dark:disabled:hover:bg-golden-glow/80'
                  disabled={verifyOtpLoading || !isFormChanged}
                  loading={verifyOtpLoading}
                >
                  Xác thực OTP
                </Button>
              </Col>
            </Row>
            <Row className='mb-0'>
              <Col className='grid-c-12'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={handleBack}
                  className='dark:border-none'
                >
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
