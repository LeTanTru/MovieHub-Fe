import { personApiRequest } from '@/api-requests';
import { PersonList } from '@/app/person/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  DEFAULT_PAGE_START,
  DEFAULT_PAGE_SIZE,
  PERSON_KIND_ACTOR,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { PersonSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import envConfig from '@/config';

export const metadata: Metadata = {
  title: 'Diễn viên',
  description:
    'Khám phá danh sách diễn viên nổi tiếng, ngôi sao điện ảnh được yêu thích trên MovieHub. Tìm hiểu thông tin chi tiết về tiểu sử, sự nghiệp và các bộ phim mới nhất của các diễn viên.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'diễn viên',
    'ngôi sao điện ảnh',
    'người nổi tiếng',
    'diễn viên moviehub'
  ],
  openGraph: {
    title: 'Diễn viên',
    description:
      'Khám phá danh sách diễn viên nổi tiếng, ngôi sao điện ảnh được yêu thích trên MovieHub. Tìm hiểu thông tin chi tiết về tiểu sử, sự nghiệp và các bộ phim mới nhất của các diễn viên.',
    url: '/person',
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
    title: 'Diễn viên',
    description:
      'Khám phá danh sách diễn viên nổi tiếng, ngôi sao điện ảnh được yêu thích trên MovieHub. Tìm hiểu thông tin chi tiết về tiểu sử, sự nghiệp và các bộ phim mới nhất của các diễn viên.',
    images: ['/logo.webp']
  },
  alternates: {
    canonical: '/person'
  }
};

export default async function PersonPage() {
  const movieFilters: PersonSearchType = {
    page: DEFAULT_PAGE_START,
    size: DEFAULT_PAGE_SIZE,
    kind: PERSON_KIND_ACTOR
  };
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.PERSON_LIST, movieFilters],
    queryFn: () => personApiRequest.getList(movieFilters)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
        <div className='max-640:gap-8 flex flex-col gap-12.5'>
          <PersonList />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
