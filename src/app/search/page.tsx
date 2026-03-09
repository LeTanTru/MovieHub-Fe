import { Search } from '@/app/search/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  return {
    title: keyword ? `Tìm kiếm phim ${keyword}` : 'Tìm kiếm phim',
    description: `Kết quả tìm kiếm cho "${keyword}" trên MovieHub.`
  };
}

export default async function SearchPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.CATEGORY_LIST, { size: MAX_PAGE_SIZE }]
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <Search />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
