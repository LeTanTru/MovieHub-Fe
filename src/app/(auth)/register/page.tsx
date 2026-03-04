import { RegisterForm } from '@/app/(auth)/register/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Trang đăng ký MovieHub'
};

export default function RegisterPage() {
  return (
    <div className='max-520:w-[95%] mx-auto flex w-full max-w-125 flex-col text-white'>
      <RegisterForm />
    </div>
  );
}
