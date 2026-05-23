import { categoryApiRequest } from '@/api-requests';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from './get-query-client';

type CategoryPrefetchBoundaryProps = {
  children: React.ReactNode;
};

export async function CategoryPrefetchBoundary({
  children
}: CategoryPrefetchBoundaryProps) {
  const queryClient = getQueryClient();
  const categoryFilters = { size: MAX_PAGE_SIZE };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.CATEGORY_LIST, categoryFilters],
    queryFn: () => categoryApiRequest.getList(categoryFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
