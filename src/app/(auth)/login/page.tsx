import { LoginForm } from '@/app/(auth)/login/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Trang đăng nhập MovieHub'
};

export default function LoginPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <LoginForm />
    </div>
  );
}
