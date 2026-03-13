import { movieApiRequest } from '@/api-requests';
import { Sidebar } from '@/app/user/_components';
import { WatchHistory } from '@/app/user/watch-history/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
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
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-1120:flex-col max-1360:gap-8 max-1120:gap-8 max-990:gap-6 relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
          <Sidebar />
          <div className='w-full grow'>
            <WatchHistory />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
