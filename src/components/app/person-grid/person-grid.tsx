import { PersonCard } from '@/components/app/person-card';
import { cn } from '@/lib';
import { PersonResType } from '@/types';

type Dir = 'up' | 'down';

export default function PersonGrid({
  personList,
  dir = 'up',
  className
}: {
  personList: PersonResType[];
  dir?: Dir;
  className?: string;
}) {
  return (
    <div className={cn('grid w-full grow grid-cols-8 gap-6', className)}>
      {personList.map((person) => (
        <PersonCard person={person} key={person.id} willNavigate dir={dir} />
      ))}
    </div>
  );
}
