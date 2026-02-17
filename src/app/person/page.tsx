import { personApiRequest } from '@/api-requests';
import { PersonList } from '@/app/person/_components';
import { getQueryClient } from '@/components/providers';
import {
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  PERSON_KIND_ACTOR,
  queryKeys
} from '@/constants';
import { PersonSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diễn viên',
  description: 'Trang danh sách diễn viên MovieHub'
};

export default async function PersonPage({
  searchParams
}: {
  searchParams: Promise<PersonSearchType>;
}) {
  const filters = await searchParams;
  const defaultFilters: PersonSearchType = {
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    kind: PERSON_KIND_ACTOR,
    ...filters
  };
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.PERSON_LIST, defaultFilters],
    queryFn: () => personApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='max-989:mb-2.5 mb-5'>
        <h3 className='max-1600:text-2xl m-0 text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
          Diễn viên
        </h3>
      </div>
      <PersonList />
    </HydrationBoundary>
  );
}
