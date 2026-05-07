import { ForgotPasswordForm } from './_components';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description:
    'Khôi phục tài khoản MovieHub bằng cách đặt lại mật khẩu qua email hoặc số điện thoại.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'quên mật khẩu moviehub',
    'khôi phục tài khoản moviehub',
    'lấy lại mật khẩu'
  ],
  alternates: {
    canonical: '/forgot-password'
  },
  openGraph: {
    title: 'Quên mật khẩu | MovieHub',
    description: 'Khôi phục tài khoản MovieHub của bạn.',
    url: '/forgot-password',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN'
  },
  twitter: {
    card: 'summary',
    title: 'Quên mật khẩu | MovieHub',
    description: 'Khôi phục tài khoản MovieHub của bạn.'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ForgotPasswordPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <ForgotPasswordForm />
    </div>
  );
}
