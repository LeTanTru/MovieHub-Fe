import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { ButtonBackToHome } from '@/app/account/_components';
import { SettingsForm } from '@/app/account/settings/_components';
import { logo } from '@/assets';
import { envConfig } from '@/config';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cài đặt',
  description:
    'Quản lý cài đặt tài khoản MovieHub như ngôn ngữ, thông báo và các tùy chọn hiển thị.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['cài đặt moviehub', 'thiết lập tài khoản', 'tùy chỉnh'],
  alternates: {
    canonical: '/account/settings'
  },
  openGraph: {
    title: 'Cài đặt | MovieHub',
    description: 'Quản lý cài đặt tài khoản MovieHub.',
    url: '/account/settings',
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
    title: 'Cài đặt | MovieHub',
    description: 'Quản lý cài đặt tài khoản MovieHub.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function SettingsPage() {
  return (
    <div className='max-990:w-120 max-768:max-w-[95%] mx-auto flex w-full max-w-150 flex-col text-white'>
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
      <SettingsForm />
    </div>
  );
}
