import { AvatarField } from '@/components/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps
} from '@/constants';
import { cn } from '@/lib';
import { ProfileResType } from '@/types';
import { renderImageUrl } from '@/utils';

type ProfileSectionProps = {
  profile: ProfileResType;
};

export function ProfileSection({ profile }: ProfileSectionProps) {
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
}

ProfileSection.Skeleton = function () {
  return (
    <>
      <Skeleton className='skeleton size-15 rounded-full!' />
      <div className='mt-4 flex items-center gap-x-1'>
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton size-4.5' />
      </div>
      <Skeleton className='skeleton mt-2 h-4 w-full text-xs' />
    </>
  );
};
