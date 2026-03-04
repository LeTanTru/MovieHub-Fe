import { VerifyOtpForm } from '@/app/(auth)/verify-otp/_components';

export default function ForgotPasswordPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <VerifyOtpForm />
    </div>
  );
}
