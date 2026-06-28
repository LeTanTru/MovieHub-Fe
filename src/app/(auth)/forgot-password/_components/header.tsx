type ForgotPasswordStepType = 1 | 2;

type ForgotPasswordHeaderProps = {
  step: ForgotPasswordStepType;
};

export function ForgotPasswordHeader({ step }: ForgotPasswordHeaderProps) {
  return (
    <div className='mb-4 flex flex-col items-center gap-2'>
      <h3 className='text-xl font-semibold'>Quên mật khẩu</h3>
      <p className='text-muted-foreground text-center'>
        {step === 1
          ? 'Nhập email để nhận mã OTP'
          : 'Nhập OTP đã được gửi đến email'}
      </p>
    </div>
  );
}
