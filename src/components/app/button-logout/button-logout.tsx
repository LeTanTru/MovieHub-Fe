'use client';

import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLogoutMutation } from '@/queries';
import { useAuthStore } from '@/store';
import { notify, removeData } from '@/utils';
import { LogOutIcon } from 'lucide-react';

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonLogout({
  className,
  ...props
}: ButtonLogoutProps) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const { mutateAsync: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutMutate();
      if (res.result) {
        removeData([storageKeys.ACCESS_TOKEN, storageKeys.REFRESH_TOKEN]);
        setProfile(null);
        notify.success('Đăng xuất thành công');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        notify.error('Đăng xuất thất bại');
      }
    } catch (error) {
      logger.error('[LOGOUT_ERROR]', error);
      notify.error('Đăng xuất thất bại');
    }
  };
  return (
    <Button
      variant='ghost'
      className={cn(
        'w-full rounded-none rounded-br rounded-bl hover:bg-black/20',
        {
          'justify-start': !logoutLoading,
          'pointer-events-none': logoutLoading
        },
        className
      )}
      onClick={handleLogout}
      loading={logoutLoading}
      {...props}
    >
      <LogOutIcon size={16} className='opacity-60' />
      <span>Đăng xuất</span>
    </Button>
  );
}
