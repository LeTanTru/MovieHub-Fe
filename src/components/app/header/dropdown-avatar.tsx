import { ProfileType } from '@/types';
import Image from 'next/image';
import React from 'react';

type DropdownAvatarProps = {
  profile: ProfileType | null;
};

export default function DropdownAvatar({ profile }: DropdownAvatarProps) {
  return (
    <div>
      {profile && (
        <Image
          src={profile.avatarPath}
          alt='Avatar'
          width={40}
          height={40}
          className='rounded-full'
        />
      )}
    </div>
  );
}
