'use client';

import {
  apiConfig,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  userSidebarList
} from '@/constants';
import { AvatarField } from '@/components/form';
import { cn } from '@/lib';
import { ProfileType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import { usePathname } from 'next/navigation';
import ButtonLogout from '@/components/button-logout';
import Link from 'next/link';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import route from '@/routes';
import { Separator } from '@/components/ui/separator';

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuthStore();

  return (
    <div className='bg-sidebar w-75 flex-shrink-0 rounded-lg p-10 pb-6 max-[1120px]:w-full max-[1120px]:pt-6 max-[1120px]:pb-0 max-[600px]:px-0'>
      <h1 className='mb-8 text-xl font-bold max-[1120px]:mb-2 max-[1120px]:text-center'>
        Quản lý tài khoản
      </h1>
      <List className='flex flex-col max-[1120px]:mt-4 max-[1120px]:flex-row max-[1120px]:justify-center max-[1120px]:gap-4 max-[640px]:gap-0'>
        {userSidebarList.map((item) => (
          <ListItem
            key={item.link}
            className={cn('text-slate-400', {
              'text-slate-100': path === item.link
            })}
          >
            <Link
              href={item.link}
              className='flex items-center gap-2 py-4 text-sm max-[1120px]:px-4 max-[800px]:flex-col max-[800px]:text-xs max-[500px]:px-2'
            >
              <item.icon
                className={cn(
                  item.className,
                  {
                    'fill-white':
                      path === route.user.favorite &&
                      item.link === route.user.favorite,
                    'fill-none stroke-2':
                      path !== route.user.favorite &&
                      item.link === route.user.favorite
                  },
                  'max-[800px]:size-4'
                )}
              />
              {item.title}
            </Link>
            <Separator className='max-[1120px]:hidden' />
          </ListItem>
        ))}
      </List>
      <div className='mt-20 max-[1120px]:hidden'>
        {!!profile ? (
          <ProfileSection profile={profile} />
        ) : (
          <ProfileSectionSkeleton />
        )}
      </div>
      <ButtonLogout className='mt-4 w-full justify-center p-0! text-slate-400 transition-all duration-200 ease-linear hover:bg-transparent! hover:text-white max-[1120px]:hidden' />
    </div>
  );
}

const ProfileSection = ({ profile }: { profile: ProfileType }) => {
  const GenderIcon = genderIconMaps[profile?.gender];

  return (
    <>
      {profile?.avatarPath ? (
        <AvatarField
          src={`${apiConfig.imageProxy.baseUrl}${profile.avatarPath}`}
        />
      ) : (
        <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full text-3xl'>
          {profile?.fullName?.charAt(0) ?? 'U'}
        </div>
      )}

      <div className='mt-5 flex items-center gap-x-1 text-sm'>
        <h1>{profile?.fullName}</h1>
        {GenderIcon && (
          <GenderIcon
            className={cn('size-4.5', {
              'stroke-cyan-500': profile?.gender === GENDER_MALE,
              'stroke-pink-500': profile?.gender === GENDER_FEMALE,
              'stroke-amber-400': profile?.gender === GENDER_OTHER
            })}
          />
        )}
      </div>
      <p className='mt-0 text-xs text-slate-400'>{profile?.email}</p>
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
