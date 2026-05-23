import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { ButtonBackToHome } from '@/app/account/_components';
import { ProfileForm } from '@/app/account/profile/_components';
import { logo } from '@/assets';
import { envConfig } from '@/config';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân',
  description:
    'Quản lý thông tin cá nhân, avatar và cập nhật hồ sơ tài khoản MovieHub của bạn.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['hồ sơ moviehub', 'thông tin cá nhân', 'cập nhật hồ sơ'],
  alternates: {
    canonical: '/account/profile'
  },
  openGraph: {
    title: 'Tài khoản | MovieHub',
    description: 'Quản lý thông tin cá nhân trên MovieHub.',
    url: '/account/profile',
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
    title: 'Tài khoản | MovieHub',
    description: 'Quản lý thông tin cá nhân trên MovieHub.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ProfilePage() {
  return (
    <div className='max-990:w-180 max-768:max-w-[95%] mx-auto flex w-full max-w-200 flex-col text-white'>
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
      <ProfileForm />
    </div>
  );
}
