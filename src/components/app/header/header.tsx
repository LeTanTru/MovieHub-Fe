'use client';

import { AnimatePresence, m } from 'framer-motion';
import DropdownAvatar from './dropdown-avatar';
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
import { FaSearch } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { NavigationMenu } from './navigation';

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

    window.addEventListener('scroll', handleOnScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleOnScroll);
  }, []);

  const handleLogin = () => {
    navigate.push(route.login.path);
  };

  return (
    <header
      className={cn('header fixed top-0 right-0 left-0 z-50 block', {
        'bg-fixed-header': isFixed,
        'bg-transparent': !isFixed
      })}
    >
      <div
        className={cn(
          'max-1600:px-5 max-1600:gap-6 max-640:px-2 max-640:gap-2 max-1360:gap-4 max-1360:px-4 max-640:h-14 flex items-center gap-8 pr-10 pl-8 transition-all duration-200 ease-linear',
          {
            'bg-fixed-header h-fixed-header max-640:h-15 max-1360:h-17.5':
              isFixed,
            'h-header max-1360:h-15 bg-transparent': !isFixed
          }
        )}
      >
        <div
          className={cn({
            'max-1360:block hidden': !showSearch,
            'max-1360:hidden': showSearch
          })}
        >
          <NavigationMenu mode='mobile' />
        </div>

        {/* Left side */}
        <Link href={route.home.path} className='shrink-0'>
          <Image
            alt='Logo'
            className={cn('max-1360:h-9 max-1360:w-auto max-640:h-7.5 h-auto', {
              hidden: showSearch
            })}
            height={46}
            src={logoWithText}
            loading='eager'
            unoptimized
          />
        </Link>

        {/* Desktop search — always visible, no animation needed */}
        <SearchForm
          className='max-1360:hidden'
          formClassName='flex h-full w-full items-center bg-transparent p-0'
        />

        {/* Mobile search — animated show/hide */}
        <AnimatePresence>
          {showSearch && (
            <m.div
              key='mobile-search-form'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'top center' }}
              className='max-1360:absolute max-1360:left-2.5 max-1360:right-12.5 max-1360:z-50 max-1360:block max-640:right-10 hidden w-auto'
            >
              <SearchForm
                className='max-1360:max-w-none max-1360:w-full'
                formClassName='flex h-full w-full items-center bg-transparent p-0'
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* Right side */}
        <div className='h-header max-1360:hidden max-1600:gap-2.5 flex grow items-center gap-8'>
          <NavigationMenu mode='desktop' />
          <div className='grow'></div>
          <AnimatePresence mode='wait' initial={false}>
            {loading ? (
              <m.div
                key='loading'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginRight: 24 }}
              >
                <div className='skeleton h-10 w-10 rounded-full!' />
              </m.div>
            ) : !profile ? (
              <m.div
                key='auth'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button onClick={handleLogin} className='w-full rounded-full'>
                  Đăng nhập
                </Button>
              </m.div>
            ) : (
              <div className='flex h-full items-center gap-x-5'>
                <m.div
                  key='notification'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <DropdownNotification /> */}
                </m.div>
                <m.div
                  key='avatar'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownAvatar profile={profile} />
                </m.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className='max-1360:block hidden grow'></div>

        {/* Mobile search toggle button */}
        <button
          type='button'
          className='mobile-search max-1360:flex max-640:size-6 max-640:pr-1 hidden size-10 items-center justify-center'
          onClick={() => setShowSearch((prev) => !prev)}
        >
          <AnimatePresence mode='wait' initial={false}>
            {!showSearch ? (
              <m.div
                key='icon-search'
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                transition={{ duration: 0.1 }}
              >
                <FaSearch className='max-640:size-4 size-5 font-semibold' />
              </m.div>
            ) : (
              <m.div
                key='icon-close'
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
                transition={{ duration: 0.1 }}
              >
                <FaXmark className='max-640:size-5 size-6 font-semibold text-red-500' />
              </m.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
