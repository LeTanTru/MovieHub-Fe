'use client';

import Pagination from '@/components/pagination';
import { usePersonListQuery } from '@/queries';
import { cn } from '@/lib';
import { DEFAULT_PAGE_SIZE, PERSON_ACTOR } from '@/constants';
import { PersonResType } from '@/types';
import { Activity } from '@/components/activity';
import PersonListSkeleton from './person-list-skeleton';
import { useQueryParams } from '@/hooks';
import { PersonCard } from '@/components/app/person-card';

export default function PersonList() {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: personListData, isLoading: personListLoading } =
    usePersonListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        size: DEFAULT_PAGE_SIZE,
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
