import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function WatchPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='bg-vulcan max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 room min-h-page-height relative flex flex-col gap-16 py-40'></Container>
    </HydrationBoundary>
  );
}
