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
      <Container className='relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='flex flex-col gap-12.5'>
          <Search />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
