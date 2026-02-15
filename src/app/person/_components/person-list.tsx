'use client';

import { Pagination } from '@/components/pagination';
import { usePersonListQuery } from '@/queries';
import { DEFAULT_PAGE_SIZE, PERSON_KIND_ACTOR } from '@/constants';
import { PersonResType } from '@/types';
import { Activity } from '@/components/activity';
import { useQueryParams } from '@/hooks';
import { PersonGrid, PersonGridSkeleton } from '@/components/app/person-grid';
import { NoData } from '@/components/no-data';

export default function PersonList() {
  const {
    searchParams: { page }
  } = useQueryParams<{ page: string }>();

  const { data: personListData, isLoading: personListLoading } =
    usePersonListQuery({
      params: {
        page: page ? Number(page) - 1 : 0,
        size: DEFAULT_PAGE_SIZE,
        kind: PERSON_KIND_ACTOR
      },
      enabled: true
    });

  const personList: PersonResType[] = personListData?.data?.content || [];
  const totalPages = personListData?.data?.totalPages || 0;

  return (
    <>
      {personListLoading ? (
        <PersonGridSkeleton />
      ) : personList.length === 0 ? (
        <NoData
          className='pt-20 pb-40'
          content={
            <>
              Không có diễn viên nào trong danh mục&nbsp;
              <span className='font-medium'>diễn viên</span>
            </>
          }
        />
      ) : (
        <PersonGrid personList={personList} />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </>
  );
}
