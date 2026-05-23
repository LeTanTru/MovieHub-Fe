import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { ButtonBackToHome } from '@/app/account/_components';
import { ChangePasswordForm } from '@/app/account/change-password/_components';
import { logo } from '@/assets';
import { envConfig } from '@/config';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description:
    'Thay đổi mật khẩu tài khoản MovieHub để bảo vệ tài khoản của bạn.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['đổi mật khẩu moviehub', 'thay đổi mật khẩu', 'bảo mật tài khoản'],
  alternates: {
    canonical: '/account/change-password'
  },
  openGraph: {
    title: 'Đổi mật khẩu | MovieHub',
    description: 'Thay đổi mật khẩu tài khoản MovieHub.',
    url: '/account/change-password',
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
    title: 'Đổi mật khẩu | MovieHub',
    description: 'Thay đổi mật khẩu tài khoản MovieHub.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ChangePasswordPage() {
  return (
    <div className='max-520:w-[95%] text-whit mx-auto flex w-full max-w-125 flex-col'>
      <div className='relative flex items-center justify-center'>
        <ButtonBackToHome />
        <Link href='/' className='inline-block'>
          <Image
            src={logo.src}
            width={80}
            height={80}
            className='max-520:size-16 mx-auto border-none bg-transparent shadow-none'
            alt='Logo'
          />
        </Link>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
