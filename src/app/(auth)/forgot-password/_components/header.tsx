import { Activity } from '@/components/activity';

type ForgotPasswordStepType = 1 | 2;

type ForgotPasswordHeaderProps = {
  step: ForgotPasswordStepType;
};

export default function ForgotPasswordHeader({
  step
}: ForgotPasswordHeaderProps) {
  return (
    <div className='mb-4 flex flex-col items-center gap-2'>
      <h3 className='text-xl font-semibold'>Quên mật khẩu</h3>
      <Activity visible={step === 1}>
        <p className='text-muted-foreground text-center'>
          Nhập email để nhận mã OTP
        </p>
      </Activity>
      <Activity visible={step === 2}>
        <p className='text-muted-foreground text-center'>
          Nhập OTP đã được gửi đến email
        </p>
      </Activity>
    </div>
  );
}
