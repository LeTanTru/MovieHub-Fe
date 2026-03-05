import { ProfileForm } from '@/app/account/profile/_components';
import { logo } from '@/assets';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Trang quản lý thông tin cá nhân'
};

export default function ProfilePage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-200 flex-col text-white'>
      <div className='flex items-center justify-center'>
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
