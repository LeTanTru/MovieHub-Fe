'use client';

import { Pagination } from '@/components/pagination';
import { usePersonListQuery } from '@/queries';
import { DEFAULT_PAGE_SIZE, PERSON_KIND_ACTOR } from '@/constants';
import { Activity } from '@/components/activity';
import { useQueryParams } from '@/hooks';
import { PersonGrid, PersonGridSkeleton } from '@/components/app/person-grid';
import { NoData } from '@/components/no-data';
import { ListHeading } from '@/components/app/heading';

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

  const personList = personListData?.data?.content || [];
  const totalPages = personListData?.data?.totalPages || 0;

  return (
    <div className='max-1600:px-5 max-640:px-4 mx-auto w-full max-w-475 px-12.5'>
      <ListHeading title='Diễn viên' />
      {personListLoading ? (
        <PersonGridSkeleton className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4' />
      ) : personList.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Không có diễn viên nào trong danh mục&nbsp;
              <span className='font-semibold'>diễn viên</span>
            </>
          }
        />
      ) : (
        <PersonGrid
          className='max-1600:gap-4 max-1360:grid-cols-6 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-640:gap-x-2 max-640:gap-y-4'
          personList={personList}
        />
      )}
      <Activity visible={!!totalPages}>
        <Pagination totalPages={totalPages} />
      </Activity>
    </div>
  );
}
