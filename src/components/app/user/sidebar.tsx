'use client';

import { AvatarField } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { apiConfig, genderIconMaps } from '@/constants';
import { GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '@/constants/constant';
import { cn } from '@/lib';
import { useAuthStore } from '@/store';
import { ProfileType } from '@/types';
import { Heart, History, ListVideo, User2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DropdownAvatarItemType = {
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  className?: string;
};

const dropdownAvatarList: DropdownAvatarItemType[] = [
  {
    link: '/user/favorite',
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: '/user/playlist',
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: '/user/watch-history',
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: '/user/profile',
    icon: User2,
    className: 'size-5',
    title: 'Hồ sơ'
  }
];

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuthStore();
  return (
    <div className='bg-sidebar w-72 rounded-lg px-8 py-8'>
      <h1 className='mb-8 text-xl font-bold'>Quản lý tài khoản</h1>
      <List className='flex flex-col'>
        {dropdownAvatarList.map((item) => (
          <ListItem
            key={item.link}
            className={cn('border-b-accent border-b text-slate-400', {
              'text-slate-100': path === item.link
            })}
          >
            <Link
              href={item.link}
              className='flex items-center gap-2 py-4 text-sm'
            >
              <item.icon
                className={cn(item.className, {
                  'fill-white':
                    path === '/user/favorite' && item.link === '/user/favorite',
                  'fill-none stroke-2':
                    path !== '/user/favorite' && item.link === '/user/favorite'
                })}
              />
              {item.title}
            </Link>
          </ListItem>
        ))}
      </List>
      {!!profile ? (
        <ProfileSection profile={profile} />
      ) : (
        <ProfileSectionSkeleton />
      )}
    </div>
  );
}

const ProfileSection = ({ profile }: { profile: ProfileType }) => {
  const GenderIcon = genderIconMaps[profile?.gender];

  return (
    <div className='mt-50'>
      {profile?.avatarPath ? (
        <AvatarField
          src={`${apiConfig.imageProxy.baseUrl}${profile.avatarPath}`}
        />
      ) : (
        <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full text-3xl'>
          {profile?.fullName?.charAt(0) ?? 'U'}
        </div>
      )}

      <div className='mt-5 flex items-center gap-x-1'>
        <h1>{profile?.fullName}</h1>
        {GenderIcon && (
          <GenderIcon
            className={cn('size-5', {
              'stroke-cyan-500': profile?.gender === GENDER_MALE,
              'stroke-pink-500': profile?.gender === GENDER_FEMALE,
              'stroke-amber-400': profile?.gender === GENDER_OTHER
            })}
          />
        )}
      </div>
      <p className='mt-0 text-xs'>{profile?.email}</p>
    </div>
  );
};

const ProfileSectionSkeleton = () => {
  return (
    <div className='mt-50'>
      <Skeleton className='h-20 w-20 animate-pulse rounded-full' />
      <div className='mt-5 flex items-center gap-x-1'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='size-4' />
      </div>
      <Skeleton className='mt-2 h-4 w-full text-xs' />
    </div>
  );
};
