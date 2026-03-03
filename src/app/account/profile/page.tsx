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
    <div className='mx-auto mt-10 flex w-full max-w-200 flex-col text-sm text-white max-[1024px]:mt-6 max-[1024px]:w-185 max-[867px]:w-170 max-[760px]:w-150 max-[640px]:mt-6 max-[640px]:w-[95%]'>
      <div className='flex items-center justify-center'>
        <Link href='/' className='inline-block'>
          <Image
            src={logo.src}
            width={80}
            height={80}
            className='mx-auto border-none bg-transparent shadow-none max-[520px]:size-16'
            alt='Logo'
          />
        </Link>
      </div>
      <ProfileForm />
    </div>
  );
}
