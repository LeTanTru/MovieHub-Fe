import { authApiRequest } from '@/apiRequests';
import { AvatarField, Button } from '@/components/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useAuthStore } from '@/store';
import { ProfileType } from '@/types';
import { notify, removeAccessTokenFromLocalStorage, removeData } from '@/utils';
import { LogOutIcon } from 'lucide-react';
import React from 'react';

type DropdownAvatarProps = {
  profile?: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { setAuthenticated, setProfile } = useAuthStore();
  const handleLogout = async () => {
    try {
      const response = await authApiRequest.logout();
      if (response.result) {
        removeAccessTokenFromLocalStorage();
        removeData(storageKeys.USER_KIND);
        setProfile(null);
        setAuthenticated(false);
        notify.success('Đăng xuất thành công');
      }
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger autoFocus={false} asChild>
        <Button
          variant='ghost'
          className='h-10 w-10 rounded-full p-0! focus:outline-none focus-visible:ring-0'
        >
          {profile?.avatarPath ? (
            <AvatarField
              src={`/api/image-proxy?url=${encodeURIComponent(profile?.avatarPath || '')}`}
              className='border-none'
              size={40}
            />
          ) : (
            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xl'>
              {profile?.fullName.charAt(0)}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background shadow-accent mr-5 border-none shadow'>
        <DropdownMenuLabel className='flex min-w-0 flex-col'>
          <span className='text-foreground truncate text-sm font-medium'>
            {profile?.fullName}
          </span>
          <span className='text-muted-foreground truncate text-xs font-normal'>
            {profile?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <LogOutIcon size={16} className='opacity-60' aria-hidden='true' />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
