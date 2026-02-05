import { ChangePasswordForm } from '@/app/user/change-password/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Trang thay đổi mật khẩu tài khoản'
};

export default function ChangePasswordPage() {
  return (
    <div className='1919:p-6 w-full p-0'>
      <ChangePasswordForm />
    </div>
  );
}
