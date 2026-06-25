import {
  DEFAULT_PAGE_START,
  FAVOURITE_TYPE_MOVIE,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { Container } from '@/components/layout';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { favouriteApiRequest } from '@/api-requests';
import { FavouriteList } from '@/app/user/favourite/_components';
import { FavouriteSearchType } from '@/types';
import { getQueryClient } from '@/components/providers/query-provider';
import { Sidebar } from '@/app/user/_components';
import { envConfig } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách phim và diễn viên yêu thích',
  description:
    'Quản lý danh sách phim và diễn viên yêu thích của bạn trên MovieHub. Lưu lại những bộ phim yêu thích để xem lại bất cứ lúc nào.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: [
    'phim yêu thích',
    'diễn viên yêu thích',
    'danh sách phim',
    'moviehub favourite'
  ],
  alternates: {
    canonical: '/user/favourite'
  },
  openGraph: {
    title: 'Danh sách yêu thích | MovieHub',
    description:
      'Quản lý danh sách phim và diễn viên yêu thích của bạn trên MovieHub.',
    url: '/user/favourite',
    siteName: 'MovieHub',
    type: 'website',
    locale: 'vi_VN',
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
    title: 'Danh sách yêu thích | MovieHub',
    description:
      'Quản lý danh sách phim và diễn viên yêu thích của bạn trên MovieHub.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function FavouritePage() {
  const pageSize = 12;

  const movieFilters: FavouriteSearchType = {
    type: FAVOURITE_TYPE_MOVIE,
    page: DEFAULT_PAGE_START,
    size: pageSize
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.FAVOURITE_LIST, movieFilters],
    queryFn: ({ signal }) => favouriteApiRequest.getList(movieFilters, signal)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 min-h-page-height relative py-40'>
        <div className='max-1120:flex-col max-1360:gap-8 max-1120:gap-8 max-990:gap-6 relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
          <Sidebar />
          <div className='w-full grow'>
            <FavouriteList />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
