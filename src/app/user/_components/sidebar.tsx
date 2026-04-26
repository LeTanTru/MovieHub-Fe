'use client';

import { userSidebarList } from '@/constants';
import { ButtonLogout } from '@/components/app/button-logout';
import { cn } from '@/lib';
import { List, ListItem } from '@/components/list';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProfileSection from './profile-section';

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuth();

  return (
    <div className='bg-user-sidebar max-1120:w-full max-1360:w-62.5 max-1120:p-0 h-fit w-75 shrink-0 rounded-lg p-10 pb-6'>
      <h1 className='max-1120:mb-0 max-1120:text-center max-1360:text-lg max-1360:mb-6 max-1360:font-semibold max-1120:font-medium max-1120:p-4 max-640:pb-2 max-640:text-base max-480:pb-0 mb-8 text-xl font-bold'>
        Quản lý tài khoản
      </h1>
      <List className='max-1120:flex-row max-1120:justify-center max-1120:gap-8 max-640:gap-4 max-640:justify-center max-520:gap-y-2 max-520:grid-cols-3 max-520:grid flex flex-col'>
        {userSidebarList.map((item) => (
          <ListItem
            key={item.link}
            className={cn('opacity-70', {
              'text-golden-glow opacity-100': path === item.link
            })}
          >
            <Link
              href={item.link}
              className='max-768:flex-col max-640:text-[13px] max-640:px-1.5 max-480:text-xs flex items-center gap-2 px-2 py-4'
            >
              <item.icon className={item.className} />
              {item.title}
            </Link>
            <Separator className='max-1120:hidden' />
          </ListItem>
        ))}
      </List>
      <div className='max-1120:hidden mt-20'>
        {!!profile ? (
          <ProfileSection profile={profile} />
        ) : (
          <ProfileSection.Skeleton />
        )}
      </div>
      <ButtonLogout className='max-1120:hidden mt-4 w-full justify-center p-0! text-slate-400 transition-all duration-200 ease-linear hover:bg-transparent! hover:text-white' />
    </div>
  );
}
