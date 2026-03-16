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
import { useAuth, useClickOutside, useNavigate } from '@/hooks';
import { cn } from '@/lib';
import { route } from '@/routes';
import { ItemProps } from '@/types';
import { renderImageUrl } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { RiMenu2Line } from 'react-icons/ri';

export default function NavigationMobile({
  navigationList
}: {
  navigationList: ItemProps[];
}) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { profile } = useAuth();
  const [selectedItem, setSelectedItem] = useState<{
    key: string;
    index: number;
  } | null>(null);
  const [dropdownTop, setDropdownTop] = useState<number>(0);

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setSelectedItem(null);
  });

  const navMobileList = userSidebarList.filter(
    (item) => item.link !== route.user.notification.path
  );

  const handleSubmenuToggle = (key: string, index: number) => {
    setSelectedItem((prev) =>
      prev?.key === key && prev?.index === index ? null : { key, index }
    );
  };

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => setOpen((prev) => !prev)}
        className='group flex size-6 items-center justify-center p-0! dark:hover:bg-transparent'
        aria-label='Open menu'
      >
        <AnimatePresence mode='wait' initial={false}>
          {open ? (
            <m.div
              key='close'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
            >
              <X className='size-6' />
            </m.div>
          ) : (
            <m.div
              key='search'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
            >
              <RiMenu2Line className='size-6' />
            </m.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8, transformOrigin: '5% 0%' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className='bg-charade max-480:w-[95%] absolute top-15 w-110 rounded-md p-4'
          >
            {!profile ? (
              <div className='flex justify-center'>
                <Button
                  onClick={() => navigate.push(route.login.path)}
                  className='w-full rounded-full'
                >
                  Đăng nhập
                </Button>
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
                              'text-cyan-500': profile?.gender === GENDER_MALE,
                              'text-pink-500':
                                profile?.gender === GENDER_FEMALE,
                              'text-amber-400': profile?.gender === GENDER_OTHER
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
                        className={cn(
                          'max-480:px-2 max-480:text-[13px] flex items-center gap-x-2 gap-y-4 rounded-md border px-4 py-2',
                          {
                            'text-golden-glow border-golden-glow':
                              pathname === item.link
                          }
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className={item.className} />
                        <Link href={item.link}>{item.title}</Link>
                      </ListItem>
                    ))}
                    <ButtonLogout className='max-480:text-[13px] max-480:px-2! justify-start rounded-md border' />
                  </List>
                </div>
                <Separator />
              </>
            )}

            <List className='max-480:mt-1 max-480:gap-1 mt-4 grid w-full grid-cols-2 gap-2'>
              {navigationList.map((item, index) =>
                item.submenu ? (
                  <ListItem
                    key={item.key}
                    className='max-480:text-[13px] relative flex cursor-pointer gap-2 p-2 select-none'
                    onClick={(e) => {
                      const coords = e.currentTarget.getBoundingClientRect();
                      setDropdownTop(coords.top - coords.height);
                      handleSubmenuToggle(item.key, index);
                    }}
                  >
                    {item.label}
                    <ChevronDown className='size-5' />
                    {item.isNew && (
                      <div className='bg-golden-glow text-main-background absolute -top-4 -right-7 rounded px-1 text-xs'>
                        Mới
                      </div>
                    )}
                  </ListItem>
                ) : (
                  <ListItem className='p-2' key={item.label}>
                    <Link
                      href={item.href as string}
                      className='max-480:text-[13px] relative'
                    >
                      {item.label}
                      {item.isNew && (
                        <div className='bg-golden-glow text-main-background absolute -top-3 -right-7 rounded px-1 text-xs'>
                          Mới
                        </div>
                      )}
                    </Link>
                  </ListItem>
                )
              )}
            </List>
            <AnimatePresence>
              {selectedItem && (
                <m.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    'dropdown bg-gunmetal-blue scrollbar-none max-800:p-4 max-768:w-150 max-768:grid-cols-3 max-640:grid-cols-2 max-640:w-[95%] max-480:left-1/2 max-480:-translate-x-1/2 absolute left-4 z-50 grid max-h-[50vh] w-180 grid-cols-4 gap-2 overflow-y-auto rounded-sm p-4 shadow-lg transition-all duration-150 ease-out',
                    {
                      'max-640:-left-0.5 -left-2': selectedItem.index % 2 === 0
                    }
                  )}
                  style={{
                    top: dropdownTop + 10,
                    transformOrigin:
                      selectedItem.index % 2 == 0 ? '24px 0px' : '240px 0px'
                  }}
                >
                  {navigationList
                    .find((item) => item.key === selectedItem.key)
                    ?.subItems?.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href as string}
                        className='max-480:text-[13px] flex cursor-pointer items-center gap-2 py-2 whitespace-nowrap'
                        onClick={() => {
                          setOpen(false);
                          setSelectedItem(null);
                        }}
                      >
                        {sub.icon && <sub.icon className='size-4' />}
                        <span className='line-clamp-1'>{sub.label}</span>
                      </Link>
                    ))}
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
