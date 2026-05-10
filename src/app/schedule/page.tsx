import { ScheduleList } from '@/app/schedule/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import envConfig from '@/config';
import { queryKeys, DATE_TIME_FORMAT, DEFAULT_DATE_FORMAT } from '@/constants';
import { formatDate } from '@/utils';
import { movieApiRequest } from '@/api-requests';

export const metadata: Metadata = {
  title: 'Lịch chiếu',
  description:
    'Theo dõi lịch chiếu phim mới nhất trên MovieHub. Cập nhật thông tin chi tiết về thời gian phát sóng các bộ phim bộ, phim lẻ hấp dẫn nhất trong tuần để không bỏ lỡ bất kỳ tập phim nào.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['lịch chiếu phim', 'thông tin lịch chiếu', 'lịch phát sóng phim'],
  openGraph: {
    title: 'Lịch chiếu',
    description:
      'Theo dõi lịch chiếu phim mới nhất trên MovieHub. Cập nhật thông tin chi tiết về thời gian phát sóng các bộ phim bộ, phim lẻ hấp dẫn nhất trong tuần để không bỏ lỡ bất kỳ tập phim nào.',
    url: '/schedule',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lịch chiếu',
    description:
      'Theo dõi lịch chiếu phim mới nhất trên MovieHub. Cập nhật thông tin chi tiết về thời gian phát sóng các bộ phim bộ, phim lẻ hấp dẫn nhất trong tuần để không bỏ lỡ bất kỳ tập phim nào.'
  },
  alternates: {
    canonical: '/schedule'
  }
};

export default async function SchedulePage() {
  const queryClient = getQueryClient();

  const date = formatDate(
    new Date().toLocaleDateString('vi-VN'),
    DATE_TIME_FORMAT,
    DEFAULT_DATE_FORMAT
  );

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_SCHEDULE_LIST, { date }],
    queryFn: () => movieApiRequest.getScheduleList({ date })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative mx-auto min-h-[calc(100dvh-400px)] max-w-350 py-40'>
        <div className='max-640:gap-8 flex min-h-[60vh] flex-col gap-12.5'>
          <ScheduleList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
