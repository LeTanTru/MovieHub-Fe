import { authApiRequest } from '@/apiRequests';
import { Button } from '@/components/form';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useProfileStore } from '@/store';
import { ProfileType } from '@/types';
import { notify, removeAccessTokenFromLocalStorage, removeData } from '@/utils';
import { LogOutIcon } from 'lucide-react';
import React from 'react';

type DropdownAvatarProps = {
  profile: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { setProfile } = useProfileStore();
  const handleLogout = async () => {
    try {
      await authApiRequest.logout();
      removeAccessTokenFromLocalStorage();
      removeData(storageKeys.USER_KIND);
      setProfile(null);
      notify.success('Đăng xuất thành công');
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger autoFocus={false} asChild>
        <Button
          variant='ghost'
          className='h-10 w-10 rounded-full focus:outline-none focus-visible:ring-0'
        >
          <Avatar>
            <AvatarImage
              src={`/api/image-proxy?url=${encodeURIComponent(profile?.avatarPath || '')}`}
            />
            <Skeleton className='h-10 w-10 rounded-full' />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background border-none'>
        <DropdownMenuLabel className='flex min-w-0 flex-col'>
          <span className='text-foreground truncate text-sm font-medium'>
            Keith Kennedy
          </span>
          <span className='text-muted-foreground truncate text-xs font-normal'>
            k.kennedy@originui.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <LogOutIcon size={16} className='opacity-60' aria-hidden='true' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
