import { PersonCard } from '@/components/app/person-card';
import { cn } from '@/lib';
import { PersonResType } from '@/types';

type Dir = 'up' | 'down';

type PersonGridProps = {
  personList: PersonResType[];
  dir?: Dir;
  className?: string;
};

export default function PersonGrid({
  personList,
  dir = 'up',
  className
}: PersonGridProps) {
  return (
    <div className={cn('grid w-full grow grid-cols-8 gap-6', className)}>
      {personList.map((person) => (
        <PersonCard person={person} key={person.id} willNavigate dir={dir} />
      ))}
    </div>
  );
}
