import { Search } from '@/app/search/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { MAX_PAGE_SIZE, queryKeys } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import envConfig from '@/config';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ keyword?: string }>;
}): Promise<Metadata> {
  const { keyword } = await searchParams;
  const normalizedKeyword = keyword?.trim();
  const title = normalizedKeyword
    ? `Tìm kiếm phim ${normalizedKeyword}`
    : 'Tìm kiếm phim';
  const description = normalizedKeyword
    ? `Kết quả tìm kiếm cho "${normalizedKeyword}" trên MovieHub. Khám phá các bộ phim liên quan đến ${normalizedKeyword} với đầy đủ thông tin, trailer và lịch chiếu mới nhất.`
    : 'Tìm kiếm phim theo tên, thể loại và quốc gia trên MovieHub. Hệ thống tìm kiếm thông minh giúp bạn dễ dàng tìm thấy bộ phim yêu thích của mình một cách nhanh chóng.';

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: [
      normalizedKeyword || 'tìm kiếm phim',
      'phim moviehub',
      'kết quả tìm kiếm',
      'xem phim'
    ],
    robots: {
      index: false,
      follow: true
    },
    alternates: {
      canonical: '/search'
    },
    openGraph: {
      title,
      description,
      url: '/search',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
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
