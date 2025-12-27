'use client';

import AuthDialog from '@/components/app/auth';
import ButtonLogout from '@/components/button-logout';
import { AvatarField, Button } from '@/components/form';
import { List, ListItem } from '@/components/list';
import { Separator } from '@/components/ui/separator';
import {
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  userSidebarList
} from '@/constants';

import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { ItemProps } from '@/types';
import { renderImageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NavigationMobile({
  navigationList
}: {
  navigationList: ItemProps[];
}) {
  const [open, setOpen] = useState(false);
  const { profile } = useAuthStore();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSub(null);
  });

  const navMobileList = userSidebarList.filter(
    (item) => item.link !== route.user.notification
  );

  return (
    <div className='1368:hidden'>
      <Button
        variant='ghost'
        onClick={() => setOpen((prev) => !prev)}
        className='group flex size-8 items-center justify-center hover:bg-transparent!'
        aria-label='Open menu'
      >
        <AnimatePresence mode='wait' initial={false}>
          {open ? (
            <motion.div
              key='close'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <X className='size-8' />
            </motion.div>
          ) : (
            <motion.div
              key='search'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <MenuIcon className='size-8' />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8, transformOrigin: '5% 0%' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className='bg-accent top-header absolute w-90 rounded-lg p-4'
          >
            {!profile ? (
              <div className='flex justify-center'>
                <AuthDialog />
              </div>
            ) : (
              <>
                <div className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <p className='text-sm'>{profile.fullName}</p>
                      {(() => {
                        const Icon = genderIconMaps[profile.gender];
                        return (
                          <Icon
                            className={cn('size-4.5', {
                              'stroke-cyan-500':
                                profile?.gender === GENDER_MALE,
                              'stroke-pink-500':
                                profile?.gender === GENDER_FEMALE,
                              'stroke-amber-400':
                                profile?.gender === GENDER_OTHER
                            })}
                          />
                        );
                      })()}
                    </div>
                    <AvatarField
                      src={renderImageUrl(profile.avatarPath)}
                      size={40}
                    />
                  </div>
                  <List className='grid grid-cols-2 gap-2 pt-2'>
                    {navMobileList.map((item) => (
                      <ListItem
                        key={item.link}
                        className='flex items-center gap-x-2 gap-y-4 rounded-lg border px-2 py-2 text-sm'
                      >
                        <item.icon className={item.className} />
                        <Link href={item.link}>{item.title}</Link>
                      </ListItem>
                    ))}
                    <ButtonLogout className='justify-start border' />
                  </List>
                </div>
                <Separator />
              </>
            )}
            <List className='mt-4 grid w-full grid-cols-2 gap-2'>
              {navigationList.map((item) =>
                item.submenu ? (
                  <ListItem
                    key={item.label}
                    className='relative flex cursor-pointer gap-2 py-2 text-sm'
                    onClick={() =>
                      setOpenSub((prev) =>
                        prev === item.label ? null : item.label
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown className='size-5' />
                    <AnimatePresence>
                      {openSub === item.label && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0,
                            transformOrigin: '5% -5%'
                          }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.05, ease: 'linear' }}
                          className='bg-popover absolute top-10 left-0 grid w-80 grid-cols-2 gap-2 rounded-sm p-2 px-6 py-4 shadow-lg'
                        >
                          <div className='absolute -top-2 left-5'>
                            <div className='bg-popover h-4 w-4 rotate-45 shadow-[-5px_-5px_8px_0px_var(--bg-popover)]' />
                          </div>
                          {item.subItems!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href!}
                              className='text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 py-2 whitespace-nowrap'
                            >
                              {sub.icon && <sub.icon className='size-4' />}
                              <span className='text-sm font-medium'>
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItem>
                ) : (
                  <Link
                    className='py-2 text-sm'
                    key={item.label}
                    href={item.href!}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
