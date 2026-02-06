import { ChangePasswordForm } from '@/app/(auth)/account/change-password/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Trang thay đổi mật khẩu tài khoản'
};

export default function ChangePasswordPage() {
  return (
    <div className='mx-auto flex w-full max-w-125 flex-col gap-8 text-sm text-white'>
      <ChangePasswordForm />
    </div>
  );
}
