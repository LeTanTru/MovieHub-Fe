'use client';
import { AvatarField, Button } from '@/components/form';
import { Separator } from '@/components/ui/separator';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useAuthStore, useProfileDialogStore } from '@/store';
import { ProfileType } from '@/types';
import { notify, removeAccessTokenFromLocalStorage, removeData } from '@/utils';
import { ChevronDown, Loader2, LogOutIcon, User2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useLogoutMutation } from '@/queries/use-auth';
import { cn } from '@/lib';

const dropdownMotion: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
    transformOrigin: '70% -10%'
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

type DropdownAvatarProps = {
  profile?: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  const { setAuthenticated, setProfile } = useAuthStore();
  const profileDialogStore = useProfileDialogStore();
  const [open, setOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (!profileDialogStore.open) {
          setOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDialogStore.open]);

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
    <div className='relative h-10' ref={ref}>
      <Button
        variant='ghost'
        className='h-full w-full rounded-full p-0! hover:bg-transparent! focus:outline-none focus-visible:ring-0'
        onClick={() => setOpen((prev) => !prev)}
      >
        {profile?.avatarPath ? (
          <AvatarField
            disablePreview
            src={`/api/image-proxy?url=${encodeURIComponent(profile?.avatarPath || '')}`}
            className='border-none'
            size={40}
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
            className='bg-background absolute top-[120%] right-[20%] mt-2 rounded-md shadow-[0px_0px_6px_2px_var(--accent)]'
          >
            <div className='absolute -top-2 right-[15%] h-2 w-4'>
              <div className='bg-background h-4 w-4 rotate-45 shadow-[-3px_-3px_4px_0px_var(--accent)]' />
            </div>
            <div className='px-4 py-3'>
              <p className='truncate text-sm font-medium'>
                {profile?.fullName}
              </p>
              <p className='text-muted-foreground truncate text-xs'>
                {profile?.email}
              </p>
            </div>
            <Separator />
            <Button
              variant='ghost'
              className='h-10 w-full justify-start rounded-none'
              onClick={() => profileDialogStore.setOpen(true)}
            >
              <User2 size={16} className='opacity-60' />
              <span>Hồ sơ</span>
            </Button>
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
