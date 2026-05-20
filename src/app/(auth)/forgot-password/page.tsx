import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
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
    locale: 'vi_VN',
    images: [
      {
        url: '/logo.webp',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'MovieHub'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Quên mật khẩu | MovieHub',
    description: 'Khôi phục tài khoản MovieHub của bạn.',
    images: ['/logo.webp']
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
