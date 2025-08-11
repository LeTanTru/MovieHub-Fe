'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import AuthDialog from '@/components/app/auth';
import DropdownAvatar from './dropdown-avatar';
import NavigationMenu from './navigation';
import DropdownNotification from './dropdown-notification';
import SearchForm from './search-form';
import Link from 'next/link';
import Image from 'next/image';
import { logoWithText } from '@/assets';
import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import route from '@/routes';

export default function Header() {
  const { profile, loading } = useAuthStore();
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleOnScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 0);
    };

    window.addEventListener('scroll', handleOnScroll);

    return () => window.removeEventListener('scroll', handleOnScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-9999 bg-transparent pr-10 pl-8 transition-all duration-200 ease-linear',
        {
          'bg-background': isFixed
        }
      )}
    >
      <div className={'flex h-17.5 items-center justify-between gap-4'}>
        <div className='gap flex h-full items-center justify-between gap-10'>
          <Link href={route.home}>
            <Image
              src={logoWithText}
              alt='Logo'
              height={44}
              className='h-11'
              priority
            />
          </Link>
          <SearchForm />
          <NavigationMenu />
        </div>
        <div className='header-height flex items-center gap-2'>
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
              <div className='flex items-center gap-x-5'>
                <motion.div
                  key='notification'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownNotification />
                </motion.div>
                <motion.div
                  key='avatar'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownAvatar profile={profile} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
