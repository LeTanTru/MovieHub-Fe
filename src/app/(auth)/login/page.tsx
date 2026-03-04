import { LoginForm } from '@/app/(auth)/login/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Trang đăng nhập MovieHub'
};

export default function LoginPage() {
  return (
    <div className='mx-auto flex w-full max-w-125 flex-col text-white max-[520px]:w-[95%]'>
      <LoginForm />
    </div>
  );
}
