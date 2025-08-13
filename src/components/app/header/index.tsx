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
import { Button } from '@/components/form';
import { Search, X } from 'lucide-react';

export default function Header() {
  const { profile, loading } = useAuthStore();
  const [isFixed, setIsFixed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
        'xxl:pr-10 xxl:pl-8 fixed top-0 right-0 left-0 z-999 bg-transparent pl-4 transition-all duration-200 ease-linear',
        {
          'bg-background': isFixed
        }
      )}
    >
      <div className={'flex h-17.5 items-center justify-between gap-4'}>
        {/* Left side */}
        <div className='xxl:gap-10 flex h-full flex-1 items-center gap-4'>
          {!showSearch && (
            <>
              <div className='xxl:hidden'>
                <NavigationMenu />
              </div>
              <Link href={route.home} className='flex-shrink-0'>
                <Image
                  src={logoWithText}
                  alt='Logo'
                  height={44}
                  className='h-11'
                  priority
                />
              </Link>
            </>
          )}
          <div className='xxl:block hidden w-92 max-w-92'>
            <SearchForm className='w-full' />
          </div>
          <div className='xxl:block hidden flex-grow-1 items-center gap-2'>
            <NavigationMenu />
          </div>
        </div>
        {/* Right side */}
        <div className='h-header xxl:flex hidden items-center gap-2'>
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
              <div className='flex h-full items-center gap-x-5'>
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
        {/* Search */}
        <div className='xxl:hidden mr-4 items-center'>
          <Button
            variant='ghost'
            className='p-1 hover:bg-transparent'
            onClick={() => setShowSearch(!showSearch)}
          >
            <AnimatePresence mode='wait' initial={false}>
              {showSearch ? (
                <motion.div
                  key='close'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className='size-5' />
                </motion.div>
              ) : (
                <motion.div
                  key='search'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Search className='size-5' />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              key='mobile-search'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'linear' }}
              className='bg-background absolute right-[50px] left-[10px] z-[1000] p-3 shadow-lg'
            >
              <SearchForm className='w-full' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
