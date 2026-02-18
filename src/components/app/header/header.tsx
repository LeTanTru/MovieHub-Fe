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
import { useAppLoading, useAuth, useNavigate } from '@/hooks';
import { route } from '@/routes';

export default function Header() {
  const { profile } = useAuth();
  const loading = useAppLoading();
  const navigate = useNavigate();
  const [isFixed, setIsFixed] = useState<boolean>(false);

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
    <header className='fixed top-0 right-0 left-0 z-10 block'>
      <div
        className={cn('pr-10 pl-8 transition-all duration-200 ease-linear', {
          'bg-fixed-header': isFixed,
          'bg-transparent': !isFixed
        })}
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
          {/* Left side */}
          <div className='flex h-full flex-1 items-center gap-8'>
            <Link href={route.home.path} className='shrink-0'>
              <Image
                alt='Logo'
                className='h-auto'
                height={46}
                src={logoWithText}
                loading='eager'
              />
            </Link>
            <div className='block h-full w-full max-w-92'>
              <SearchForm className='flex h-full w-full items-center bg-transparent p-0' />
            </div>
            <div className='block grow items-center gap-2'>
              <NavigationMenu />
            </div>
          </div>
          {/* Right side */}
          <div className='h-header flex items-center gap-2'>
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
        </div>
      </div>
    </header>
  );
}
