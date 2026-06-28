'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  Button,
  Col,
  OtpInputField,
  PasswordField,
  Row
} from '@/components/form';
import { ForgotPasswordBodyType } from '@/types';
import { Separator } from '@/components/ui/separator';

const MAX_RESEND = 3; // RESEND LIMIT EACH 10 MINUTES

type StepTwoFormSectionProps = {
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
};

export function StepTwoFormSection({
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
}: StepTwoFormSectionProps) {
  return (
    <>
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
          <span className='block text-center text-gray-500'>
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
            className='bg-golden-glow hover:bg-golden-glow/80 disabled:bg-golden-glow/80 disabled:hover:bg-golden-glow/80'
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
            className='border-none'
          >
            Quay lại
          </Button>
        </Col>
      </Row>
    </>
  );
}
