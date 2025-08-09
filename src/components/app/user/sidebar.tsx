'use client';
import ButtonLogout from '@/components/button-logout';
import { AvatarField } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { apiConfig, genderIconMaps, userSidebarList } from '@/constants';
import { GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '@/constants/constant';
import { cn } from '@/lib';
import route from '@/routes';
import { useAuthStore } from '@/store';
import { ProfileType } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const path = usePathname();
  const { profile } = useAuthStore();

  return (
    <div className='bg-sidebar w-72 rounded-lg px-8 py-8 pb-6'>
      <h1 className='mb-8 text-xl font-bold'>Quản lý tài khoản</h1>
      <List className='flex flex-col'>
        {userSidebarList.map((item) => (
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
                    path === route.user.favorite &&
                    item.link === route.user.favorite,
                  'fill-none stroke-2':
                    path !== route.user.favorite &&
                    item.link === route.user.favorite
                })}
              />
              {item.title}
            </Link>
          </ListItem>
        ))}
      </List>
      <div className='mt-20'>
        {!!profile ? (
          <ProfileSection profile={profile} />
        ) : (
          <ProfileSectionSkeleton />
        )}
      </div>
      <ButtonLogout className='mt-4 w-full justify-center p-0! text-slate-400 transition-all duration-200 ease-linear hover:bg-transparent! hover:text-white' />
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

      <div className='mt-5 flex items-center gap-x-1'>
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
