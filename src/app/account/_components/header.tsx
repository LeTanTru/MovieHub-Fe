'use client';

import { AnimatePresence, m } from 'framer-motion';
import DropdownAvatar from './dropdown-avatar';
import { useAppLoading, useAuth } from '@/hooks';
import { route } from '@/routes';
import Link from 'next/link';
import Image from 'next/image';
import { logoWithText } from '@/assets';
import { Skeleton } from '@/components/ui/skeleton';

export default function Header() {
  const { profile } = useAuth();
  const loading = useAppLoading();

  return (
    <header className='header relative top-0 right-0 left-0 z-10 block'>
      <div
        className={
          'max-1600:pl-6 max-1600:pr-8 max-1360:pl-4 max-1360:pr-6 max-1024:px-4 h-header max-1536:h-18 max-520:h-16 flex items-center justify-between bg-transparent pr-10 pl-8 transition-all duration-200 ease-linear'
        }
      >
        <div className='flex h-full items-center gap-4 gap-8'>
          <Link href={route.home.path} className='shrink-0'>
            <Image
              alt='Logo'
              className='max-1360:h-10 max-1360:w-auto h-auto'
              height={46}
              src={logoWithText}
              loading='eager'
              unoptimized
            />
          </Link>
        </div>
        <div className='grow'></div>
        <div className='flex items-center gap-2'>
          <AnimatePresence mode='wait' initial={false}>
            {loading || !profile ? (
              <m.div
                key='loading'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginRight: 24 }}
              >
                <Skeleton className='skeleton h-10 w-10 rounded-full!' />
              </m.div>
            ) : (
              <div className='flex h-full items-center gap-x-5'>
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
      </div>
    </header>
  );
}
