'use client';

import { ButtonAddPlayList } from '@/components/app/button-playlist';
import { MAX_PLAYLIST_COUNT } from '@/constants';
import { NoData } from '@/components/no-data';
import { useEffect, useMemo } from 'react';
import { usePlaylistListQuery } from '@/queries';
import { usePlaylistStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import PlaylistCard from './playlist-card';
import PlaylistCardSkeleton from './playlist-skeleton';

export default function Playlist() {
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );

  const { data: playlistData, isLoading } = usePlaylistListQuery({
    enabled: true
  });

  const playlist = useMemo(() => playlistData?.data || [], [playlistData]);

  useEffect(() => {
    if (!selectedPlaylist && playlist.length > 0) {
      setSelectedPlaylist(playlist[0]);
    }
  }, [playlist, selectedPlaylist, setSelectedPlaylist]);

  return (
    <div className='max-1360:mb-4 mb-6'>
      <div className='max-1360:mb-4 mb-6 flex items-center gap-4'>
        <h3 className='max-640:text-base text-xl leading-normal font-semibold text-white'>
          Danh sách phát
        </h3>
        {playlist.length < MAX_PLAYLIST_COUNT && <ButtonAddPlayList />}
      </div>
      {isLoading ? (
        <div className='max-1360:gap-4 max-1360:grid-cols-3 max-800:gap-2 max-800:grid-cols-2 grid grid-cols-5 gap-6'>
          {Array.from({ length: MAX_PLAYLIST_COUNT }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      ) : playlist.length === 0 ? (
        <NoData
          className='max-640:pb-20 max-640:pt-10 pt-25 pb-40'
          imageClassName='max-640:size-40 max-480:size-30'
          content='Bạn chưa có danh sách phát nào'
        />
      ) : (
        <div className='max-1360:gap-4 max-1360:grid-cols-3 max-800:gap-2 max-800:grid-cols-2 grid w-full grid-cols-5 gap-6'>
          {playlist.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))}
        </div>
      )}
    </div>
  );
}
