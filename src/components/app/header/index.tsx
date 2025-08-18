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
import { useIsMounted } from '@/hooks';

export default function Header() {
  const { profile, loading } = useAuthStore();
  const mounted = useIsMounted();
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
    <header className='fixed top-0 right-0 left-0 z-10 block max-[800px]:relative max-[800px]:top-auto max-[800px]:right-auto max-[800px]:left-auto'>
      <div
        className={cn(
          'bg-transparent pl-4 transition-all duration-200 ease-linear min-[1368px]:pr-10 min-[1368px]:pl-8',
          {
            'bg-background': isFixed && mounted
          }
        )}
      >
        <div className={'flex h-17.5 items-center justify-between gap-4'}>
          {/* Left side */}
          <div className='flex h-full flex-1 items-center gap-4 min-[1368px]:gap-10'>
            {!showSearch && (
              <>
                <div className='min-[1368px]:hidden'>
                  <NavigationMenu />
                </div>
                <Link href={route.home} className='flex-shrink-0'>
                  <Image
                    src={logoWithText}
                    alt='Logo'
                    height={46}
                    className='h-auto max-[1919px]:h-10 max-[1359px]:h-9'
                  />
                </Link>
              </>
            )}
            <div className='hidden w-80 max-w-92 min-[1368px]:block'>
              <SearchForm className='w-full' />
            </div>
            <div className='hidden flex-grow-1 items-center gap-2 min-[1368px]:block'>
              <NavigationMenu />
            </div>
          </div>
          {/* Right side */}
          <div className='h-header hidden items-center gap-2 min-[1368px]:flex'>
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
          <div className='mr-4 items-center min-[1368px]:hidden'>
            <Button
              variant='ghost'
              className='p-1 hover:bg-transparent!'
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
                    <X className='size-6' />
                  </motion.div>
                ) : (
                  <motion.div
                    key='search'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Search className='size-6' />
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
      </div>
    </header>
  );
}
