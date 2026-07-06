'use client';

import { ActorCell } from './actor-cell';
import { cn } from '@/lib';
import type { PersonResType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type ActorListProps = {
  actors: PersonResType[];
};

export function ActorList({ actors }: ActorListProps) {
  return (
    <div
      className={cn(
        'max-640:py-2 flex-wrap items-end gap-2 border-t border-solid border-white/10 py-4',
        {
          'flex items-center': actors.length === 0
        }
      )}
    >
      <h3
        className={cn('text-xl font-medium whitespace-nowrap text-white', {
          'mb-4': actors.length > 0
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

ActorList.Skeleton = function ActorListSkeleton() {
  return (
    <div className='max-640:py-2 border-t border-solid border-white/10 py-4'>
      <Skeleton className='skeleton mb-4 h-7 w-24' />
      <div className='max-1120:grid-cols-6 max-640:grid-cols-3 max-800:grid-cols-5 max-480:grid-cols-2 max-640:text-[13px] max-520:text-xs grid grid-cols-3 gap-x-2.5 gap-y-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`actor-${index}`}
            className='flex flex-col items-center gap-3 text-center'
          >
            <Skeleton className='skeleton size-20 rounded-full!' />
            <Skeleton className='skeleton h-4 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
};
