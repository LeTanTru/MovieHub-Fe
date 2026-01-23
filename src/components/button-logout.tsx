'use client';

import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLogoutMutation } from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import {
  notify,
  removeAccessTokenFromLocalStorage,
  removeData,
  removeRefreshTokenFromLocalStorage
} from '@/utils';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonLogout(props: ButtonLogoutProps) {
  const { setProfile } = useAuthStore();
  const { mutateAsync: logoutMutation, isPending } = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await logoutMutation();
      if (res.result) {
        removeAccessTokenFromLocalStorage();
        removeRefreshTokenFromLocalStorage();
        removeData(storageKeys.USER_KIND);
        setProfile(null);
        notify.success('Đăng xuất thành công');
        router.push(route.home.path);
      }
    } catch (error) {
      logger.error('Logout failed:', error);
      notify.error('Đăng xuất thất bại');
    }
  };
  return (
    <Button
      variant='ghost'
      className={cn('h-10 w-full rounded-none', {
        'justify-start': !isPending,
        'pointer-events-none': isPending
      })}
      onClick={handleLogout}
      {...props}
      loading={isPending}
    >
      <LogOutIcon size={16} className='opacity-60' />
      <span>Đăng xuất</span>
    </Button>
  );
}
