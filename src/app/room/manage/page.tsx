import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/components/providers/query-provider';
import { RoomList } from '@/app/room/manage/_components';

export default function RoomManagePage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative flex flex-col gap-16 py-40'>
        <RoomList />
      </Container>
    </HydrationBoundary>
  );
}
