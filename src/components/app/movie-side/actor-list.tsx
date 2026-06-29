import { ActorCell } from './actor-cell';
import { cn } from '@/lib';
import { PersonResType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type ActorListProps = {
  actors: PersonResType[];
};

const ACTOR_SKELETON_COUNT = 6;

export function ActorList({ actors }: ActorListProps) {
  return (
    <div
      className={cn('max-1120:hidden mb-5 flex-wrap items-end gap-2', {
        flex: actors.length === 0
      })}
    >
      <h3
        className={cn('font-medium whitespace-nowrap text-white', {
          'mb-4 text-xl': actors.length > 0
        })}
      >
        Diễn viên:
      </h3>
      {actors.length > 0 ? (
        <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
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
    <div className='max-1120:hidden mb-5'>
      <Skeleton className='skeleton mb-4 h-8 w-32' />
      <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
        {Array.from({ length: ACTOR_SKELETON_COUNT }).map((_, index) => (
          <div
            key={`actor-skeleton-${index}`}
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
