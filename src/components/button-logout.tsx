'use client';

import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useLogoutMutation } from '@/queries';
import route from '@/routes';
import { useAuthStore } from '@/store';
import { notify, removeAccessTokenFromLocalStorage, removeData } from '@/utils';
import { Loader2, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ButtonLogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonLogout(props: ButtonLogoutProps) {
  const { setAuthenticated, setProfile } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      if (response.result) {
        removeAccessTokenFromLocalStorage();
        removeData(storageKeys.USER_KIND);
        setProfile(null);
        setAuthenticated(false);
        notify.success('Đăng xuất thành công');
        router.push(route.home);
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
        'justify-start': !logoutMutation.isPending,
        'pointer-events-none': logoutMutation.isPending
      })}
      onClick={handleLogout}
      {...props}
    >
      {logoutMutation.isPending ? (
        <Loader2 className='h-6! w-6! animate-spin' />
      ) : (
        <>
          <LogOutIcon size={16} className='opacity-60' />
          <span>Đăng xuất</span>
        </>
      )}
    </Button>
  );
}
