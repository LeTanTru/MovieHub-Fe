'use client';
import { Button, Col, OtpInputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { storageKeys, verifyOtpErrorMaps } from '@/constants';
import { useNavigate } from '@/hooks';
import { logger } from '@/logger';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/queries';
import { route } from '@/routes';
import { otpSchema } from '@/schemaValidations';
import { VerifyOtpBodyType } from '@/types';
import {
  applyFormErrors,
  getData,
  notify,
  removeData,
  removeDatas,
  setData
} from '@/utils';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const MAX_RESEND = 3; // RESEND LIMIT EACH 10 MINUTES
const RESEND_INTERVAL = 10 * 60 * 1000; // TIME TO RESEND AFTER REACH LIMIT
const COOLDOWN_TIME = 60 * 1000; // COOL DOWN BETWEEN EACH RESENDS

export default function VerifyOtpForm() {
  const navigate = useNavigate();

  const [resendData, setResendData] = useState<{
    count: number;
    timestamp: number;
  }>({ count: 0, timestamp: 0 });
  const [countdown, setCountdown] = useState<number>(0); // Store cooldown time if reaching resend limitation
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0); // Store remaining time for next resend time
  const [lastResendTime, setLastResendTime] = useState<number>(0); // Store last resend time OTP successfully
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const { mutateAsync: resendOtpMutate, isPending: resendOtpLoading } =
    useResendOtpMutation();
  const { mutateAsync: verifyOtpMutate, isPending: verifyOtpLoading } =
    useVerifyOtpMutation();

  const defaultValues: VerifyOtpBodyType = {
    email: getData(storageKeys.EMAIL) ?? '',
    otp: ''
  };

  useEffect(() => {
    const lastTime = getData(storageKeys.LAST_RESEND_TIME);
    if (lastTime) {
      setLastResendTime(parseInt(lastTime));
    } else {
      const now = Date.now();
      setLastResendTime(now);
      setData(storageKeys.LAST_RESEND_TIME, now.toString());
    }
  }, []);

  const getResendData = () => {
    const data = getData(storageKeys.RESEND_OTP_TIME);
    if (!data) return { count: 0, timestamp: 0 };
    return JSON.parse(data);
  };

  useEffect(() => {
    const data = getResendData();
    setResendData(data);

    const lastTime = getData(storageKeys.LAST_RESEND_TIME);
    if (lastTime) {
      setLastResendTime(parseInt(lastTime));
    }
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
      setCountdown(remaining > 0 ? remaining : 0);

      if (remaining <= 0 && resendData.count > 0) {
        setResendDataToLS(0, 0);
        setResendData({ count: 0, timestamp: 0 });
      }

      if (lastResendTime > 0) {
        const cooldown = COOLDOWN_TIME - (now - lastResendTime);
        setCooldownRemaining(cooldown > 0 ? cooldown : 0);
      } else {
        setCooldownRemaining(0);
      }
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
            setResendData({ count, timestamp });
            setLastResendTime(now);
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
    removeDatas([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
    navigate.back();
  };

  const handleClearData = () => {
    removeDatas([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
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
    <section className='bg-vintage-blue max-520:px-4 rounded-lg px-6 py-4'>
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
        {(form) => {
          return (
            <>
              <Row>
                <Col className='w-full'>
                  <OtpInputField
                    name='otp'
                    control={form.control}
                    label='Nhập OTP'
                    required
                    description={
                      <>
                        <span className='text-center text-sm'>
                          Mã OTP đã được gửi đến email của bạn, <br /> có thời
                          hạn sử dụng trong vòng 5 phút.
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
              <Row className='flex-col'>
                <Col className='my-2 w-full'>
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
                <Col className='w-full'>
                  <span className='block text-center text-sm text-gray-500'>
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
                        Vui lòng đợi {Math.ceil(cooldownRemaining / 1000)} giây
                        để gửi lại
                      </>
                    )}
                  </span>
                </Col>
              </Row>

              <div className='bg-accent mb-4 h-px w-full'></div>
              <Row className='mb-4'>
                <Col className='w-full'>
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
                <Col className='w-full'>
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
          );
        }}
      </BaseForm>
    </section>
  );
}
