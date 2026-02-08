'use client';

import { AnimatePresence, motion } from 'framer-motion';
import DropdownAvatar from './dropdown-avatar';
import { useAppLoading, useAuth } from '@/hooks';
import { route } from '@/routes';
import Link from 'next/link';
import Image from 'next/image';
import { logoWithText } from '@/assets';

export default function Header() {
  const { profile } = useAuth();
  const loading = useAppLoading();

  return (
    <header className='max-800:relative max-800:top-auto max-800:right-auto max-800:left-auto fixed top-0 right-0 left-0 z-10 block'>
      <div
        className={
          '1368:pr-10 1368:pl-8 bg-transparent pl-4 transition-all duration-200 ease-linear'
        }
      >
        <div
          className={
            'h-header flex items-center justify-between gap-2 transition-all duration-200 ease-linear'
          }
        >
          <div className='1368:gap-8 flex h-full flex-1 items-center gap-4'>
            <Link href={route.home.path} className='shrink-0'>
              <Image
                alt='Logo'
                className='max-1919:h-10 max-1359:h-9 h-auto'
                height={46}
                src={logoWithText}
                loading='eager'
              />
            </Link>
          </div>
          <div className='h-header 1368:flex items-center gap-2'>
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
              ) : (
                <div className='flex h-full items-center gap-x-5'>
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
