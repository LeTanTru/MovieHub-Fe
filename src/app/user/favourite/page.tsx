import {
  DEFAULT_PAGE_START,
  FAVOURITE_TYPE_MOVIE,
  queryKeys
} from '@/constants';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { favouriteApiRequest } from '@/api-requests';
import { FavouriteList } from '@/app/user/favourite/_components';
import { FavouriteSearchType } from '@/types';
import { getQueryClient } from '@/components/providers';
import { Sidebar } from '@/app/user/_components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách phim và diễn viên yêu thích',
  description: 'Quản lý danh sách phim và diễn viên yêu thích của bạn'
};

export default async function FavouritePage({
  searchParams
}: {
  searchParams: Promise<FavouriteSearchType>;
}) {
  const filters = await searchParams;
  const pageSize = 12;

  const defaultFilters: FavouriteSearchType = {
    type: FAVOURITE_TYPE_MOVIE,
    page: DEFAULT_PAGE_START,
    size: pageSize,
    ...filters
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.FAVOURITE_LIST, defaultFilters],
    queryFn: () => favouriteApiRequest.getList(defaultFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='min-h-[calc(100dvh-400px)] py-40'>
        <div className='relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
          <Sidebar />
          <div className='grow'>
            <FavouriteList />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
