'use client';

import { AvatarField } from '@/components/form';
import { cn } from '@/lib';
import { route } from '@/routes';
import { PersonResType } from '@/types';
import { renderImageUrl } from '@/utils';
import Link from 'next/link';

const ActorCell = ({ actor }: { actor: PersonResType }) => {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='bg-main-background relative h-20 w-20 shrink-0 overflow-hidden rounded-full'
      >
        <AvatarField
          src={renderImageUrl(actor.avatarPath)}
          alt={actor.otherName}
          className='transition-all duration-200 ease-linear hover:scale-105'
          size={80}
          disablePreview
        />
      </Link>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='hover:text-golden-glow mb-1.5 line-clamp-2 leading-normal font-normal whitespace-normal text-white transition-all duration-200 ease-linear'
        title={actor.otherName}
      >
        {actor.otherName}
      </Link>
    </div>
  );
};

export default function ActorList({ actors }: { actors: PersonResType[] }) {
  return (
    <div
      className={cn(
        'flex-wrap items-end gap-2 border-t border-solid border-white/10 pt-7.5',
        {
          flex: actors.length === 0
        }
      )}
    >
      <h3
        className={cn('font-medium whitespace-nowrap text-white', {
          'max-640:mb-6 mb-8 text-xl': actors.length > 0
        })}
      >
        Diễn viên:
      </h3>
      {actors.length > 0 ? (
        <div className='max-1120:grid-cols-6 max-640:grid-cols-3 max-800:grid-cols-5 max-480:grid-cols-2 max-640:text-[13px] max-520:text-xs grid grid-cols-3 gap-x-2.5 gap-y-6'>
          {actors.map((actor) => (
            <ActorCell key={`info-actor-${actor.id}`} actor={actor} />
          ))}
        </div>
      ) : (
        <span className='text-foreground/80'>Đang cập nhật</span>
      )}
    </div>
  );
}
