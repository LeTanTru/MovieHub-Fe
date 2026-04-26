import ActorCell from './actor-cell';
import { cn } from '@/lib';
import { PersonResType } from '@/types';

type ActorListProps = {
  actors: PersonResType[];
};

export default function ActorList({ actors }: ActorListProps) {
  return (
    <div
      className={cn('max-1120:hidden mb-5 flex-wrap items-end gap-2', {
        flex: actors.length === 0
      })}
    >
      <h3
        className={cn('font-medium whitespace-nowrap text-white', {
          'mb-8 text-xl': actors.length > 0
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
