'use client';

import { Activity } from '@/components/activity';
import { MovieCard } from '@/components/app/movie-card';
import { MovieGrid } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Pagination } from '@/components/pagination';
import { getQueryClient } from '@/components/providers/query-provider';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  usePlaylistMoviesQuery,
  useRemovePlaylistItemMutation
} from '@/queries';
import { usePlaylistStore } from '@/store';
import { notify } from '@/utils';
import { useState } from 'react';

export default function MovieList() {
  const [page, setPage] = useState(1);

  const pageSize = 12;
  const playlist = usePlaylistStore((s) => s.selectedPlaylist);
  const queryClient = getQueryClient();

  const {
    data: playlistMoviesData,
    isLoading,
    refetch: getPlaylistMovies
  } = usePlaylistMoviesQuery({
    playlistId: playlist?.id || '',
    params: {
      page: page - 1,
      size: pageSize
    }
  });

  const { mutateAsync: removePlaylistItemMutate } =
    useRemovePlaylistItemMutation();

  const movieList = playlistMoviesData?.data?.content || [];
  const totalPages = playlistMoviesData?.data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleDeleteMovieFromPlaylist = async (movieId: string) => {
    if (!playlist) return;

    await removePlaylistItemMutate(
      {
        playlistId: playlist.id,
        movieId
      },
      {
        onSuccess: async (res) => {
          if (res.result) {
            notify.success('Xóa phim khỏi danh sách phát thành công');
            await getPlaylistMovies();
            await queryClient.invalidateQueries({
              queryKey: [queryKeys.PLAYLIST_LIST]
            });
          } else {
            notify.error('Xóa phim khỏi danh sách phát thất bại');
          }
        },
        onError: (error) => {
          logger.error('[REMOVE_MOVIE_FROM_PLAYLIST_ERROR]', error);
          notify.error('Xóa phim khỏi danh sách phát thất bại');
        }
      }
    );
  };

  if (!playlist) return null;

  return (
    <>
      <div
        key={playlist.id}
        role='tabpanel'
        id={`playlist-tabpanel-${playlist.id}`}
        aria-labelledby={`playlist-tab-${playlist.id}`}
        className='block w-full'
      >
        {isLoading ? (
          <MovieGrid.Skeleton
            className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'
            skeletonCount={12}
          />
        ) : movieList.length === 0 ? (
          <NoData
            className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
            imageClassName='max-640:size-40 max-480:size-30'
            content={
              <>
                Danh sách <span className='font-semibold'>{playlist.name}</span>
                &nbsp;trống
                <br />
                Hãy tìm kiếm và thêm phim vào danh sách phát nhé 😊
              </>
            }
          />
        ) : (
          <div className='max-1600:grid-cols-5 max-1360:grid-cols-4 max-1120:grid-cols-5 max-800:grid-cols-4 max-640:grid-cols-3 max-480:grid-cols-2 max-1600:gap-4 max-480:gap-y-4 max-640:gap-y-6 grid w-full grow grid-cols-6 gap-6'>
            {movieList.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onDelete={handleDeleteMovieFromPlaylist}
                deleteMessage='Bạn có chắc chắn muốn xóa phim này khỏi danh dánh sách phát này không?'
                dir='down'
              />
            ))}
          </div>
        )}
      </div>
      <Activity visible={!!totalPages}>
        <Pagination
          totalPages={totalPages}
          onChange={handlePageChange}
          page={page}
        />
      </Activity>
    </>
  );
}
