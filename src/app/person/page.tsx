import { personApiRequest } from '@/api-requests';
import { PersonList } from '@/app/person/_components';
import { Container } from '@/components/layout';
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

export default async function PersonPage() {
  const defaultFilters: PersonSearchType = {
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    kind: PERSON_KIND_ACTOR
  };
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.PERSON_LIST, defaultFilters],
    queryFn: () => personApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='flex flex-col gap-12.5'>
          <PersonList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
