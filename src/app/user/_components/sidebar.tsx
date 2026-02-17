'use client';

import {
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  userSidebarList
} from '@/constants';
import { cn } from '@/lib';
import { ProfileType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import ButtonLogout from '@/components/button-logout';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { renderImageUrl } from '@/utils';
import { List, ListItem } from '@/components/list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { defaultAvatar } from '@/assets';
import { useAuth } from '@/hooks';

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuth();

  return (
    <div className='bg-user-sidebar max-1120:w-full max-1120:pt-6 max-1120:pb-0 max-1537:ml-4 max-600:px-0 h-fit w-75 shrink-0 rounded-lg p-10 pb-6'>
      <h1 className='max-1120:mb-2 max-1120:text-center mb-8 text-xl font-bold'>
        Quản lý tài khoản
      </h1>
      <List className='max-1120:mt-4 max-1120:flex-row max-1120:justify-center max-1120:gap-4 flex flex-col max-sm:gap-0'>
        {userSidebarList.map((item) => (
          <ListItem
            key={item.link}
            className={cn('opacity-70', {
              'text-light-golden-yellow opacity-100': path === item.link
            })}
          >
            <Link
              href={item.link}
              className='max-1120:px-4 max-800:flex-col max-800:text-xs max-500:px-2 flex items-center gap-2 py-4 text-sm'
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
      {profile?.avatarPath ? (
        <Avatar className='h-15 w-15'>
          <AvatarImage
            src={renderImageUrl(profile.avatarPath)}
            alt={profile.fullName}
          />
          <AvatarFallback>
            <AvatarImage src={defaultAvatar.src} alt={profile.fullName} />
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className='bg-muted flex h-15 w-15 items-center justify-center rounded-full text-3xl'>
          {profile.fullName.charAt(0) ?? 'U'}
        </div>
      )}

      <div className='mt-5 flex items-center gap-x-1 text-sm'>
        <h1>{profile.fullName}</h1>
        <GenderIcon
          className={cn('ml-1 size-4.5', {
            'text-cyan-500': profile.gender === GENDER_MALE,
            'text-pink-500': profile.gender === GENDER_FEMALE,
            'text-amber-400': profile.gender === GENDER_OTHER
          })}
        />
      </div>
      <p className='mt-0 text-xs text-slate-400'>{profile.email}</p>
    </>
  );
};

const ProfileSectionSkeleton = () => {
  return (
    <>
      <Skeleton className='h-20 w-20 animate-pulse rounded-full' />
      <div className='mt-5 flex items-center gap-x-1'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='size-4.5' />
      </div>
      <Skeleton className='mt-2 h-4 w-full text-xs' />
    </>
  );
};
