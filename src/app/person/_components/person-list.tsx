'use client';

import { Pagination } from '@/components/pagination';
import { usePersonListQuery } from '@/queries';
import { DEFAULT_PAGE_SIZE, PERSON_KIND_ACTOR } from '@/constants';
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

  const personList = personListData?.data?.content || [];
  const totalPages = personListData?.data?.totalPages || 0;

  return (
    <div className='mx-auto w-full max-w-475 px-12.5'>
      <div className='flex-start relative mb-5 flex min-h-11 items-center gap-4'>
        <h3 className='text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Diễn viên
        </h3>
      </div>
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
    </div>
  );
}
