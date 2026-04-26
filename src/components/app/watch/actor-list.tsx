'use client';

import ActorCell from './actor-cell';
import { cn } from '@/lib';
import { PersonResType } from '@/types';

type ActorListProps = {
  actors: PersonResType[];
};

export default function ActorList({ actors }: ActorListProps) {
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
