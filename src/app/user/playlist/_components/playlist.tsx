'use client';

import { ButtonAddPlayList } from '@/components/app/button-playlist';
import { MAX_PLAYLIST_COUNT } from '@/constants';
import { NoData } from '@/components/no-data';
import { useEffect } from 'react';
import { usePlaylistListQuery } from '@/queries';
import { useAuth, useSelectedPlaylist } from '@/hooks';
import { PlaylistCard } from './playlist-card';

export function Playlist() {
  const { isAuthenticated } = useAuth();

  const { selectedPlaylist, setSelectedPlaylist } = useSelectedPlaylist();

  const { data: playlist = [], isLoading } = usePlaylistListQuery({
    enabled: isAuthenticated
  });

  useEffect(() => {
    if (!selectedPlaylist && playlist.length > 0) {
      setSelectedPlaylist(playlist[0]);
    }
  }, [playlist, selectedPlaylist, setSelectedPlaylist]);

  return (
    <div className='max-1360:mb-4 mb-6'>
      <div className='max-1360:mb-4 max-640:gap-2 mb-6 flex items-center gap-4'>
        <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
          Danh sách phát ({playlist.length})
        </h3>
        {playlist.length < MAX_PLAYLIST_COUNT && <ButtonAddPlayList />}
      </div>
      {!isAuthenticated || isLoading ? (
        <div className='max-1360:gap-4 max-1360:grid-cols-4 max-990:grid-cols-3 max-768:grid-cols-2 max-520:flex max-520:flex-nowrap max-520:overflow-x-auto scrollbar-none max-520:gap-2 grid w-full grid-cols-5 gap-6'>
          {Array.from({ length: MAX_PLAYLIST_COUNT }).map((_, index) => (
            <PlaylistCard.Skeleton key={index} />
          ))}
        </div>
      ) : playlist.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content={
            <>
              Bạn chưa có danh sách phát nào
              <br />
              Hãy tạo danh phát đầu tiên và thêm phim vào nhé 😊
            </>
          }
        />
      ) : (
        <div className='max-1360:gap-4 max-1360:grid-cols-4 max-990:grid-cols-3 max-768:grid-cols-2 max-520:flex max-520:flex-nowrap max-520:overflow-x-auto scrollbar-none max-520:gap-2 grid w-full grid-cols-5 gap-6'>
          {playlist.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))}
        </div>
      )}
    </div>
  );
}
