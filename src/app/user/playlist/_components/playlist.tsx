'use client';

import PlaylistSkeleton from './playlist-skeleton';
import PlaylistCard from './playlist-card';
import { ButtonAddPlayList } from '@/components/app/button-action-playlist';
import { NoData } from '@/components/no-data';
import { usePlaylistListQuery } from '@/queries';
import { cn } from '@/lib';
import { usePlaylistStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useEffect, useMemo } from 'react';
import { MAX_PLAYLIST_COUNT } from '@/constants';

export default function Playlist() {
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );

  const { data: playlistListData, isLoading } = usePlaylistListQuery({
    enabled: true
  });

  const playlistList = useMemo(
    () => playlistListData?.data || [],
    [playlistListData]
  );

  useEffect(() => {
    if (!selectedPlaylist && playlistList.length > 0) {
      setSelectedPlaylist(playlistList[0]);
    }
  }, [playlistList, selectedPlaylist, setSelectedPlaylist]);

  return (
    <div className='mb-6'>
      <div className='mb-6 flex items-center gap-4'>
        <h3 className='text-xl leading-normal font-semibold text-white'>
          Danh sách phát
        </h3>
        {playlistList.length < MAX_PLAYLIST_COUNT && <ButtonAddPlayList />}
      </div>
      <div
        className={cn('grid grid-cols-5 gap-6', {
          'grid-cols-1': playlistList.length === 0
        })}
      >
        {isLoading ? (
          <PlaylistSkeleton />
        ) : playlistList.length === 0 ? (
          <NoData className='pt-25' content='Bạn chưa có danh sách phát nào' />
        ) : (
          playlistList.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))
        )}
      </div>
    </div>
  );
}
