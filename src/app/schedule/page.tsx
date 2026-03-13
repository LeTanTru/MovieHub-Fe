import { ScheduleList } from '@/app/schedule/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch chiếu',
  description: 'Xem lịch chiếu phim'
};

export default function SchedulePage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative mx-auto min-h-[calc(100dvh-400px)] max-w-350 py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <ScheduleList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
