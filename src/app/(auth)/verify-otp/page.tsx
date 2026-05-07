import { VerifyOtpForm } from '@/app/(auth)/verify-otp/_components';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Xác minh OTP',
  description:
    'Nhập mã OTP để xác minh tài khoản MovieHub và hoàn tất đăng ký hoặc khôi phục mật khẩu.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['xác minh otp', 'xác nhận tài khoản', 'moviehub otp'],
  alternates: {
    canonical: '/verify-otp'
  },
  openGraph: {
    title: 'Xác minh OTP | MovieHub',
    description: 'Xác minh tài khoản MovieHub của bạn.',
    url: '/verify-otp',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary',
    title: 'Xác minh OTP | MovieHub',
    description: 'Xác minh tài khoản MovieHub của bạn.'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ForgotPasswordPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <VerifyOtpForm />
    </div>
  );
}
