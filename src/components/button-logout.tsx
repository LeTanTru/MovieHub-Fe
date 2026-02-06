'use client';

import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLogoutMutation, useRemoveCookieServerMutation } from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { notify, removeDatas } from '@/utils';
import { LogOutIcon } from 'lucide-react';

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonLogout(props: ButtonLogoutProps) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const { mutateAsync: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const { mutateAsync: removeCookieMutate, isPending: removeCookieLoading } =
    useRemoveCookieServerMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutMutate();
      if (res.result) {
        removeDatas([
          storageKeys.ACCESS_TOKEN,
          storageKeys.REFRESH_TOKEN,
          storageKeys.USER_KIND
        ]);
        await removeCookieMutate();
        setProfile(null);
        notify.success('Đăng xuất thành công');
        setTimeout(() => {
          window.location.href = route.home.path;
        }, 500);
      }
    } catch (error) {
      logger.error('Logout failed:', error);
      notify.error('Đăng xuất thất bại');
    }
  };
  return (
    <Button
      variant='ghost'
      className={cn('w-full rounded-none rounded-br rounded-bl', {
        'justify-start': !logoutLoading && !removeCookieLoading,
        'pointer-events-none': logoutLoading || removeCookieLoading
      })}
      onClick={handleLogout}
      loading={logoutLoading || removeCookieLoading}
      {...props}
    >
      <LogOutIcon size={16} className='opacity-60' />
      <span>Đăng xuất</span>
    </Button>
  );
}
