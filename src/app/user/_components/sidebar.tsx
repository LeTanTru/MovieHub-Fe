'use client';

import {
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  userSidebarList
} from '@/constants';
import { ButtonLogout } from '@/components/app/button-logout';
import { cn } from '@/lib';
import { List, ListItem } from '@/components/list';
import { ProfileType } from '@/types';
import { renderImageUrl } from '@/utils';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AvatarField } from '@/components/form';

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuth();

  return (
    <div className='bg-user-sidebar max-1120:w-full max-1360:w-62.5 max-1120:p-0 h-fit w-75 shrink-0 rounded-lg p-10 pb-6'>
      <h1 className='max-1120:mb-0 max-1120:text-center max-1360:text-lg max-1360:mb-6 max-1360:font-semibold max-1120:font-medium max-1120:p-4 max-640:pb-2 max-640:text-base max-480:pb-0 mb-8 text-xl font-bold'>
        Quản lý tài khoản
      </h1>
      <List className='max-1120:flex-row max-1120:justify-center max-1120:gap-x-6 max-990:gap-x-4 max-800:gap-x-3 max-720:gap-x-1 max-640:flex-wrap max-640:grid max-640:grid-cols-4 max-520:grid-cols-3 max-640:justify-center flex flex-col'>
        {userSidebarList.map((item) => (
          <ListItem
            key={item.link}
            className={cn('opacity-70', {
              'text-golden-glow opacity-100': path === item.link
            })}
          >
            <Link
              href={item.link}
              className='max-1120:p-4 max-720:px-3 max-640:text-xs max-800:text-[13px] max-990:flex-col max-420:px-0 flex items-center gap-2 py-4'
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
          <ProfileSectionSkeleton />
        )}
      </div>
      <ButtonLogout className='max-1120:hidden mt-4 w-full justify-center p-0! text-slate-400 transition-all duration-200 ease-linear hover:bg-transparent! hover:text-white' />
    </div>
  );
}

const ProfileSection = ({ profile }: { profile: ProfileType }) => {
  const GenderIcon = genderIconMaps[profile.gender || GENDER_OTHER];

  return (
    <>
      <AvatarField
        src={renderImageUrl(profile.avatarPath)}
        alt={profile.fullName}
        size={60}
      />

      <div className='mt-4 flex items-start gap-x-1'>
        <h3 className='mb-2'>{profile.fullName}</h3>
        <GenderIcon
          className={cn('ml-1 size-4.5 shrink-0', {
            'text-cyan-500': profile.gender === GENDER_MALE,
            'text-pink-500': profile.gender === GENDER_FEMALE,
            'text-amber-400': profile.gender === GENDER_OTHER
          })}
        />
      </div>
      <p className='mt-0 text-[13px] text-slate-400'>{profile.email}</p>
    </>
  );
};

const ProfileSectionSkeleton = () => {
  return (
    <>
      <Skeleton className='skeleton h-15 w-15 rounded-full!' />
      <div className='mt-4 flex items-center gap-x-1'>
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton size-4.5' />
      </div>
      <Skeleton className='skeleton mt-2 h-4 w-full text-xs' />
    </>
  );
};
