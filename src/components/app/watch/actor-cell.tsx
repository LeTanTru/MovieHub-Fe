import { AvatarField } from '@/components/form';
import { route } from '@/routes';
import { PersonResType } from '@/types';
import { renderImageUrl } from '@/utils';
import Link from 'next/link';

type ActorCellProps = {
  actor: PersonResType;
};

export function ActorCell({ actor }: ActorCellProps) {
  return (
    <div className='flex flex-col items-center gap-3 text-center'>
      <Link
        href={`${route.person.path}/${actor.id}`}
        className='bg-main-background relative size-20 shrink-0 overflow-hidden rounded-full'
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
}
