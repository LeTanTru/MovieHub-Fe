'use client';

import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLogoutMutation } from '@/queries';
import { useAuthStore } from '@/store';
import { notify, removeData } from '@/utils';
import { LogOutIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/modal';

const LOGOUT_REDIRECT_DELAY = 500;

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonLogout({ className, ...props }: ButtonLogoutProps) {
  const clearState = useAuthStore((s) => s.clearState);
  const { mutate: logoutMutate, isPending: logoutLoading } =
    useLogoutMutation();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onError: (error) => {
        logger.error('[LOGOUT_ERROR]', error);
      },
      onSettled: () => {
        removeData([storageKeys.ACCESS_TOKEN, storageKeys.REFRESH_TOKEN]);
        clearState();
        notify.success('Đăng xuất thành công');
        setTimeout(() => {
          window.location.reload();
        }, LOGOUT_REDIRECT_DELAY);
      }
    });
  };
  return (
    <ConfirmModal
      message='Bạn có chắc chắn muốn đăng xuất không?'
      onConfirm={handleLogout}
      trigger={
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
          loading={logoutLoading}
          {...props}
        >
          <LogOutIcon size={16} className='opacity-60' />
          <span>Đăng xuất</span>
        </Button>
      }
    />
  );
}
