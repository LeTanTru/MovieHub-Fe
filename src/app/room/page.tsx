import { Background, Room } from '@/app/room/_components';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem chung'
};

export default async function RoomPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative py-40'>
        <Background />
        <Room />
      </Container>
    </HydrationBoundary>
  );
}
