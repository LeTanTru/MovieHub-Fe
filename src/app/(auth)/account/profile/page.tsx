import { ProfileForm } from '@/app/(auth)/account/profile/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Trang quản lý thông tin cá nhân'
};

export default function ProfilePage() {
  return (
    <div className='mx-auto flex w-full max-w-200 flex-col text-sm text-white'>
      <ProfileForm />
    </div>
  );
}
