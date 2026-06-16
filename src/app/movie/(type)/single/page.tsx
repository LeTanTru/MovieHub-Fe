import { movieApiRequest } from '@/api-requests';
import { MovieList } from '@/app/movie/(type)/single/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  movieTypes,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { MovieSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { envConfig } from '@/config';

export const metadata: Metadata = {
  title: 'Phim lẻ',
  description:
    'Danh sách phim lẻ mới nhất, phim chiếu rạp hấp dẫn, cập nhật nhanh nhất. Xem phim lẻ online chất lượng cao, đa dạng thể loại, phim lẻ thuyết minh, lồng tiếng cực hay trên MovieHub.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['phim lẻ', 'phim lẻ mới', 'phim chiếu rạp', 'phim đơn'],
  openGraph: {
    title: 'Phim lẻ',
    description:
      'Danh sách phim lẻ mới nhất, phim chiếu rạp hấp dẫn, cập nhật nhanh nhất. Xem phim lẻ online chất lượng cao, đa dạng thể loại, phim lẻ thuyết minh, lồng tiếng cực hay trên MovieHub.',
    url: '/movie/single',
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
    title: 'Phim lẻ',
    description:
      'Danh sách phim lẻ mới nhất, phim chiếu rạp hấp dẫn, cập nhật nhanh nhất. Xem phim lẻ online chất lượng cao, đa dạng thể loại, phim lẻ thuyết minh, lồng tiếng cực hay trên MovieHub.',
    images: ['/logo.webp']
  },
  alternates: {
    canonical: '/movie/single'
  }
};

export default async function MovieSinglePage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const movieFilters: MovieSearchType = {
    page: page ? Number(page) - 1 : DEFAULT_PAGE_START,
    type: movieTypes.MOVIE_TYPE_SINGLE,
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
          <MovieList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
