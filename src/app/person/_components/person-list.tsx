'use client';

import './person-list.css';
import PersonCard from './person-card';
import Pagination from '@/components/pagination';
import { useSearchParams } from 'next/navigation';
import { usePersonListQuery } from '@/queries';
import { cn } from '@/lib';
import { PERSON_ACTOR } from '@/constants';
import { PersonResType } from '@/types';
import { Activity } from '@/components/activity';
import PersonListSkeleton from './person-list-skeleton';

export default function PersonList() {
  const personSize = 24;
  const params = useSearchParams();
  const page = params.get('page') ?? 1;

  const { data: personListData, isLoading: personListLoading } =
    usePersonListQuery({
      params: {
        page: +page - 1,
        size: personSize,
        kind: PERSON_ACTOR
      },
      enabled: true
    });

  const personList: PersonResType[] = personListData?.data?.content || [];
  const totalPages = personListData?.data?.totalPages || 0;

  return (
    <>
      <div className={cn('grid grid-cols-8 gap-6')}>
        {personListLoading ? (
          <PersonListSkeleton />
        ) : (
          personList.map((person) => (
            <PersonCard person={person} key={person.id} />
          ))
        )}
      </div>
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </>
  );
}
