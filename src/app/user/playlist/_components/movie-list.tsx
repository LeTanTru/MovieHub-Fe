'use client';
import { Activity } from '@/components/activity';
import { MovieCard } from '@/components/app/movie-card';
import { MovieGridSkeleton } from '@/components/app/movie-grid';
import { NoData } from '@/components/no-data';
import { Pagination } from '@/components/pagination';
import { getQueryClient } from '@/components/providers';
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

  const pageSize = 16;
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
          logger.error('Error while removing movie from playlist', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  if (!playlist) return null;

  return (
    <>
      {isLoading ? (
        <MovieGridSkeleton className='grid-cols-8' skeletonCount={16} />
      ) : movieList.length === 0 ? (
        <NoData
          className='pt-20'
          content={
            <>
              Danh sách <span className='font-semibold'>{playlist.name}</span>
              &nbsp;trống
            </>
          }
        />
      ) : (
        <div className='grid w-full grow grid-cols-8 gap-6'>
          {movieList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDeleteMovieFromPlaylist}
              dir='down'
            />
          ))}
        </div>
      )}
      <Activity visible={!!totalPages}>
        <Pagination
          totalPages={totalPages}
          onPageChange={handlePageChange}
          page={page}
        />
      </Activity>
    </>
  );
}
