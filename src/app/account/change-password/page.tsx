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
    <div className='mx-auto mt-10 flex w-full max-w-125 flex-col text-sm text-white max-[640px]:mt-6 max-[520px]:w-[95%] max-[480px]:mt-4'>
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
      <ChangePasswordForm />
    </div>
  );
}
