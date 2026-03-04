import { VerifyOtpForm } from '@/app/(auth)/verify-otp/_components';

export default function ForgotPasswordPage() {
  return (
    <div className='mx-auto flex w-full max-w-125 flex-col text-white max-[520px]:w-[95%]'>
      <VerifyOtpForm />
    </div>
  );
}
