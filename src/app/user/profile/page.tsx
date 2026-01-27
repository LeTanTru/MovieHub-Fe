import { ProfileForm } from '@/app/user/profile/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ',
  description: 'Trang quản lý thông tin cá nhân'
};

export default function ProfilePage() {
  return (
    <div className='1919:p-6 w-full p-0'>
      <ProfileForm />
    </div>
  );
}
