'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import AuthDialog from '@/components/app/auth';
import DropdownAvatar from '@/components/app/header/dropdown-avatar';
import NavigationMenu from './navigation';
import ProfileDialog from '@/components/app/header/profile-dialog';

export default function Header() {
  const { profile, loading } = useAuthStore();

  return (
    <div>
      <header className='border-b pr-8 pl-0'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Left side */}
          <NavigationMenu />
          {/* Right side */}
          <div className='flex items-center gap-2'>
            {/* <DarkModeToggle /> */}
            <AnimatePresence mode='wait' initial={false}>
              {loading ? (
                <motion.div
                  key='loading'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginRight: 24 }}
                >
                  <Skeleton className='h-10 w-10 rounded-full' />
                </motion.div>
              ) : !profile ? (
                <motion.div
                  key='auth'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AuthDialog />
                </motion.div>
              ) : (
                <motion.div
                  key='avatar'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownAvatar profile={profile} />
                </motion.div>
              )}
            </AnimatePresence>
            <ProfileDialog />
          </div>
        </div>
      </header>
    </div>
  );
}
