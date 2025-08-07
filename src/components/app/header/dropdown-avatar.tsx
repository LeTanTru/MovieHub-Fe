'use client';
import { AvatarField, Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { apiConfig, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useAuthStore } from '@/store';
import { ProfileType } from '@/types';
import { notify, removeAccessTokenFromLocalStorage, removeData } from '@/utils';
import {
  ChevronDown,
  Heart,
  History,
  ListVideo,
  Loader2,
  LogOutIcon,
  User2
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useLogoutMutation } from '@/queries/use-auth';
import { cn } from '@/lib';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import Link from 'next/link';

const dropdownMotion: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transformOrigin: '80% -5%'
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'linear'
    }
  }
};

type DropdownAvatarItemType = {
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  className?: string;
};

const dropdownAvatarList: DropdownAvatarItemType[] = [
  {
    link: '/user/favorite',
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: '/user/playlist',
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },

  {
    link: '/user/watch-history',
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: '/user/profile',
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];

type DropdownAvatarProps = {
  profile?: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { setAuthenticated, setProfile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      if (response.result) {
        removeAccessTokenFromLocalStorage();
        removeData(storageKeys.USER_KIND);
        setProfile(null);
        setAuthenticated(false);
        notify.success('Đăng xuất thành công');
      }
    } catch (error) {
      logger.error('Logout failed:', error);
      notify.error('Đăng xuất thất bại');
    }
  };

  return (
    <div className='header-height relative'>
      <Button
        variant='ghost'
        className='h-full w-full rounded-full p-0! hover:bg-transparent! focus:outline-none focus-visible:ring-0'
        onClick={() => setOpen((prev) => !prev)}
      >
        {profile?.avatarPath ? (
          <AvatarField
            disablePreview
            src={`${apiConfig.imageProxy.baseUrl}${profile.avatarPath}`}
            className='border-none'
            size={50}
          />
        ) : (
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xl'>
            {profile?.fullName?.charAt(0) ?? 'U'}
          </div>
        )}
        <ChevronDown />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownMotion}
            initial='initial'
            animate='animate'
            exit='exit'
            className='bg-background absolute top-19 right-[16%] mt-2 rounded-md shadow-[0px_0px_6px_2px_var(--accent)] before:absolute before:-top-4 before:right-0 before:left-0 before:h-4 before:w-full before:bg-transparent before:content-[""]'
          >
            <div className='absolute -top-2 right-[16%] h-2 w-4'>
              <div className='bg-background h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <div className='w-48 px-4 py-3'>
              <p className='truncate overflow-hidden text-sm font-medium whitespace-nowrap'>
                {profile?.fullName}
              </p>
              <p className='text-muted-foreground truncate text-xs'>
                @{profile?.username}
              </p>
            </div>
            <Separator />
            <List>
              {dropdownAvatarList.map((item) => (
                <ListItem key={item.link} onClick={() => setOpen(false)}>
                  <Link
                    href={item.link}
                    className='hover:bg-accent hover:text-accent-foreground flex h-10 w-full cursor-pointer items-center justify-start gap-2 rounded-none px-4 text-sm transition-all duration-200 ease-linear focus:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50'
                  >
                    <item.icon size={16} className={item.className} />
                    <span>{item.title}</span>
                  </Link>
                </ListItem>
              ))}
            </List>
            <Separator />
            <Button
              variant='ghost'
              className={cn('h-10 w-full rounded-none', {
                'justify-start': !logoutMutation.isPending,
                'pointer-events-none': logoutMutation.isPending
              })}
              onClick={handleLogout}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
