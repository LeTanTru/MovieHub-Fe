import { ChangePasswordForm } from '@/app/account/change-password/_components';
import { logo } from '@/assets';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Trang thay đổi mật khẩu tài khoản'
};

export default function ChangePasswordPage() {
  return (
    <div className='max-1536:mt-15 max-1024:mt-10 max-640:mt-6 max-520:w-[95%] max-480:mt-4 mx-auto mt-20 flex w-full max-w-125 flex-col text-white'>
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
      <ChangePasswordForm />
    </div>
  );
}
