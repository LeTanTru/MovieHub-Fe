'use client';

import { ButtonLogout } from '@/components/app/button-logout';
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
import { useAuth, useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
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
  const [open, setOpen] = useState<boolean>(false);
  const { profile } = useAuth();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSub(null);
  });

  const navMobileList = userSidebarList.filter(
    (item) => item.link !== route.user.notification.path
  );

  return (
    <div className='max-1360:block hidden'>
      <Button
        variant='ghost'
        onClick={() => setOpen((prev) => !prev)}
        className='group flex size-10 items-center justify-center dark:hover:bg-transparent'
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
            transition={{ duration: 0.15, ease: 'linear' }}
            className='bg-gunmetal-black absolute top-15 w-120 rounded-lg p-4 max-md:w-90'
          >
            {!profile ? (
              <div className='flex justify-center'>
                <Button className='w-full rounded-full'>Đăng nhập</Button>
              </div>
            ) : (
              <>
                <div className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <p className=''>{profile.fullName}</p>
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
                      className='mx-0'
                    />
                  </div>
                  <List className='grid grid-cols-2 gap-2 pt-2'>
                    {navMobileList.map((item) => (
                      <ListItem
                        key={item.link}
                        className='flex items-center gap-x-2 gap-y-4 rounded-lg border px-4 py-2 max-md:px-2'
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
                    className='relative flex cursor-pointer gap-2 p-2 select-none'
                    onClick={() =>
                      setOpenSub((prev) =>
                        prev === item.label ? null : item.label
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown className='size-5' />
                    {item.isNew && (
                      <div className='bg-golden-glow text-main-background absolute -top-4.5 -right-1 rounded p-0.5 text-xs'>
                        Mới
                      </div>
                    )}
                    <AnimatePresence>
                      {openSub === item.label && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                            transformOrigin: '5% 0%'
                          }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15, ease: 'linear' }}
                          className='bg-gunmetal-blue scrollbar-none absolute top-10 left-0 z-10 grid max-h-[50vh] w-150 grid-cols-3 gap-4 overflow-y-auto rounded-sm p-2 px-6 py-4 shadow-lg max-lg:w-120 max-lg:grid-cols-2 max-lg:gap-3'
                        >
                          {item.subItems?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href as string}
                              className='text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 py-2 whitespace-nowrap'
                            >
                              {sub.icon && <sub.icon className='size-4' />}
                              <span className='line-clamp-1 font-medium'>
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItem>
                ) : (
                  <ListItem className='p-2' key={item.label}>
                    <Link href={item.href as string} className='relative'>
                      {item.label}
                      {item.isNew && (
                        <div className='bg-golden-glow text-main-background absolute -top-4.5 -right-5 rounded p-0.5 text-xs'>
                          Mới
                        </div>
                      )}
                    </Link>
                  </ListItem>
                )
              )}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
