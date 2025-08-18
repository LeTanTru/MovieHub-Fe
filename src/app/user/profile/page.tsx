import ProfileForm from './profile-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ',
  description: 'Trang quản lý thông tin cá nhân'
};

export default function ProfilePage() {
  return (
    <div className='w-full p-0 min-[1919px]:p-6'>
      <ProfileForm />
    </div>
  );
}
