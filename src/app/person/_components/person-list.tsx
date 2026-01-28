'use client';

import './person-list.css';
import PersonCard from './person-card';
import PersonCardSkeleton from './person-card-skeleton';
import Pagination from '@/components/pagination';
import { useSearchParams } from 'next/navigation';
import { usePersonListQuery } from '@/queries';
import { cn } from '@/lib';
import { PERSON_ACTOR } from '@/constants';
import { PersonResType } from '@/types';
import { Activity } from '@/components/activity';

export default function PersonList() {
  const skeletonCount = 24;
  const params = useSearchParams();
  const page = params.get('page') ?? 0;

  const { data: personListData, isLoading: personListLoading } =
    usePersonListQuery(
      {
        page: page,
        size: skeletonCount,
        kind: PERSON_ACTOR
      },
      true
    );

  const personList: PersonResType[] = personListData?.data?.content || [];
  const totalPages = personListData?.data?.totalPages || 0;

  return (
    <>
      <div className={cn('grid grid-cols-8 gap-6')}>
        {personListLoading
          ? Array.from({ length: skeletonCount }, (_, index) => (
              <PersonCardSkeleton key={index} />
            ))
          : personList?.map((person) => (
              <PersonCard person={person} key={person.id} />
            ))}
      </div>
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </>
  );
}
