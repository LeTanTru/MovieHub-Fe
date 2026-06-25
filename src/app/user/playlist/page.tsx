import { playlistApiRequest } from '@/api-requests';
import { Sidebar } from '@/app/user/_components';
import { MovieList, Playlist } from '@/app/user/playlist/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import {
  DEFAULT_PAGE_START,
  queryKeys,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT
} from '@/constants';
import { ApiResponse, PlaylistResType, PlaylistSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { envConfig } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách phát',
  description:
    'Quản lý và xem các danh sách phát phim yêu thích của bạn trên MovieHub. Tạo playlist để sắp xếp phim theo ý thích.',
  metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
  keywords: ['danh sách phát', 'playlist phim', 'tạo playlist', 'quản lý phim'],
  alternates: {
    canonical: '/user/playlist'
  },
  openGraph: {
    title: 'Danh sách phát | MovieHub',
    description:
      'Quản lý và xem các danh sách phát phim yêu thích của bạn trên MovieHub.',
    url: '/user/playlist',
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
    title: 'Danh sách phát | MovieHub',
    description:
      'Quản lý và xem các danh sách phát phim yêu thích của bạn trên MovieHub.',
    images: ['/logo.webp']
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function PlaylistPage() {
  const queryClient = getQueryClient();

  const pageSize = 12;

  const playlistMoviesFilters: PlaylistSearchType = {
    page: DEFAULT_PAGE_START,
    size: pageSize
  };

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.PLAYLIST_LIST],
    queryFn: ({ signal }) => playlistApiRequest.getList(signal)
  });

  const res: ApiResponse<PlaylistResType[]> | undefined =
    await queryClient.getQueryData([queryKeys.PLAYLIST_LIST]);

  const firstPlaylistId = res?.data?.[0]?.id;

  if (firstPlaylistId) {
    await queryClient.prefetchQuery({
      queryKey: [
        queryKeys.PLAYLIST_MOVIES,
        firstPlaylistId,
        playlistMoviesFilters
      ],
      queryFn: ({ signal }) =>
        playlistApiRequest.getListMovies(
          firstPlaylistId,
          playlistMoviesFilters,
          signal
        )
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 min-h-page-height relative py-40'>
        <div className='max-1120:flex-col max-1360:gap-8 max-1120:gap-8 max-990:gap-6 relative z-3 mx-auto flex max-w-410 items-start justify-between gap-10 px-5'>
          <Sidebar />
          <div className='w-full grow'>
            <Playlist />
            <MovieList />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
