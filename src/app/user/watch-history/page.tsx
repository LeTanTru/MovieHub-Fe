import { movieApiRequest } from '@/api-requests';
import { Sidebar } from '@/app/user/_components';
import { WatchHistory } from '@/app/user/watch-history/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers';
import { queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem tiếp',
  description: 'Quản lý và xem lại lịch sử xem phim của bạn'
};

export default async function WatchHistoryPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_HISTORY],
    queryFn: () => movieApiRequest.getHistoryList()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='min-h-[calc(100dvh-400px)] py-40'>
        <div className='relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
          <Sidebar />
          <div className='grow'>
            <WatchHistory />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
