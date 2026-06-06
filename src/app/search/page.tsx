import { Search } from '@/app/search/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  DEFAULT_PAGE_SIZE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  queryKeys
} from '@/constants';
import { movieApiRequest } from '@/api-requests';
import { MovieSearchType, SearchParamsType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { envConfig } from '@/config';

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
      type: 'website',
      images: [
        {
          url: '/logo.webp',
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: 'MovieHub'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.webp']
    }
  };
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<Partial<SearchParamsType>>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvedSearchParams.page
    ? Number(resolvedSearchParams.page) - 1
    : 0;

  const queryFilterParams = Object.fromEntries(
    Object.entries(resolvedSearchParams).reduce<[string, string][]>(
      (acc, [key, value]) => {
        if (key !== 'page' && !!value) {
          acc.push([
            key,
            Array.isArray(value) ? value.join(',') : String(value)
          ]);
        }

        return acc;
      },
      []
    )
  ) as Partial<SearchParamsType>;

  const movieFilters: MovieSearchType = {
    ...queryFilterParams,
    page: currentPage,
    size: DEFAULT_PAGE_SIZE
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.MOVIE_LIST, movieFilters],
    queryFn: ({ signal }) => movieApiRequest.getList(movieFilters, signal)
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
