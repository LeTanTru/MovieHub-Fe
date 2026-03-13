import { playlistApiRequest } from '@/api-requests';
import { Sidebar } from '@/app/user/_components';
import { MovieList, Playlist } from '@/app/user/playlist/_components';
import { Container } from '@/components/layout';
import { getQueryClient } from '@/components/providers/query-provider';
import { DEFAULT_PAGE_START, queryKeys } from '@/constants';
import { ApiResponse, PlaylistResType, PlaylistSearchType } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách phát',
  description: 'Quản lý và xem các danh sách phát phim yêu thích của bạn'
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
    queryFn: () => playlistApiRequest.getList()
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
      queryFn: () =>
        playlistApiRequest.getListMovies(firstPlaylistId, playlistMoviesFilters)
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
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
