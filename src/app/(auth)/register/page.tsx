import { RegisterForm } from '@/app/(auth)/register/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Trang đăng ký MovieHub'
};

export default function RegisterPage() {
  return (
    <div className='mx-auto flex w-full max-w-125 flex-col text-white max-[520px]:w-[95%]'>
      <RegisterForm />
    </div>
  );
}
