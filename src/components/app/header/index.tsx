'use client';

import { AnimatePresence, motion } from 'framer-motion';
import DropdownAvatar from './dropdown-avatar';
import NavigationMenu from './navigation';
import DropdownNotification from './dropdown-notification';
import SearchForm from './search-form';
import Link from 'next/link';
import Image from 'next/image';
import { logoWithText } from '@/assets';
import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import { Button } from '@/components/form';
import { Search, X } from 'lucide-react';
import { useAppLoading, useAuth, useNavigate } from '@/hooks';
import { route } from '@/routes';

export default function Header() {
  const { profile } = useAuth();
  const loading = useAppLoading();
  const navigate = useNavigate();
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useEffect(() => {
    const handleOnScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 0);
    };

    window.addEventListener('scroll', handleOnScroll);

    return () => window.removeEventListener('scroll', handleOnScroll);
  }, []);

  const handleLogin = () => {
    navigate(route.login.path);
  };

  return (
    <header className='max-800:relative max-800:top-auto max-800:right-auto max-800:left-auto fixed top-0 right-0 left-0 z-10 block'>
      <div
        className={cn(
          '1368:pr-10 1368:pl-8 bg-transparent pl-4 transition-all duration-200 ease-linear',
          {
            'bg-fixed-header': isFixed
          }
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-2 transition-all duration-200 ease-linear',
            {
              'h-fixed-header': isFixed,
              'h-header': !isFixed
            }
          )}
        >
          <div className='1368:gap-8 flex h-full flex-1 items-center gap-4'>
            {!showSearch && (
              <>
                <div className='1368:hidden'>
                  <NavigationMenu />
                </div>
                <Link href={route.home.path} className='shrink-0'>
                  <Image
                    alt='Logo'
                    className='max-1919:h-10 max-1359:h-9 h-auto'
                    height={46}
                    src={logoWithText}
                    loading='eager'
                  />
                </Link>
              </>
            )}
            <div className='1368:block hidden h-full w-full max-w-92'>
              <SearchForm className='flex h-full w-full items-center bg-transparent p-0' />
            </div>
            <div className='1368:block hidden grow items-center gap-2'>
              <NavigationMenu />
            </div>
          </div>
          {/* Right side */}
          <div className='h-header 1368:flex hidden items-center gap-2'>
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
                  <div className='skeleton h-10 w-10 rounded-full!' />
                </motion.div>
              ) : !profile ? (
                <motion.div
                  key='auth'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button onClick={handleLogin} className='w-full rounded-full'>
                    Đăng nhập
                  </Button>
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
          <div className='1368:hidden mr-4 items-center'>
            <Button
              variant='ghost'
              className='p-1 hover:bg-transparent!'
              onClick={() => setShowSearch(!showSearch)}
              aria-label='Search icon'
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
                className='absolute right-12.5 left-2.5 z-1000 p-3 shadow-lg'
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
