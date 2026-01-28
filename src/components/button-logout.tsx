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

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonLogout(props: ButtonLogoutProps) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const { mutateAsync: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutMutate();
      if (res.result) {
        removeAccessTokenFromLocalStorage();
        removeRefreshTokenFromLocalStorage();
        removeData(storageKeys.USER_KIND);
        setProfile(null);
        notify.success('Đăng xuất thành công');
        window.location.href = route.home.path;
      }
    } catch (error) {
      logger.error('Logout failed:', error);
      notify.error('Đăng xuất thất bại');
    }
  };
  return (
    <Button
      variant='ghost'
      className={cn('w-full rounded-none', {
        'justify-start': !logoutLoading,
        'pointer-events-none': logoutLoading
      })}
      onClick={handleLogout}
      loading={logoutLoading}
      {...props}
    >
      <LogOutIcon size={16} className='opacity-60' />
      <span>Đăng xuất</span>
    </Button>
  );
}
