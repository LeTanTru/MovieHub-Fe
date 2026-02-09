'use client';

import PlaylistSkeleton from './playlist-skeleton';
import PlaylistCard from './playlist-card';
import { ButtonAddPlayList } from '@/components/app/button-action-playlist';
import { NoData } from '@/components/no-data';
import { usePlaylistListQuery } from '@/queries';
import { cn } from '@/lib';

export default function Playlist() {
  const { data: playlistListData, isLoading } = usePlaylistListQuery({
    enabled: true
  });

  const playlistList = playlistListData?.data || [];

  return (
    <div className='grow p-10'>
      <div className='mb-8 flex items-center gap-4'>
        <h3 className='text-xl leading-normal font-semibold text-white'>
          Danh sách phát
        </h3>
        <ButtonAddPlayList />
      </div>
      <div
        className={cn('grid gap-6', {
          'grid-cols-5': playlistList.length > 0
        })}
      >
        {isLoading ? (
          <PlaylistSkeleton />
        ) : playlistList.length == 0 ? (
          <NoData className='pt-20' />
        ) : (
          playlistList.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))
        )}
      </div>
    </div>
  );
}
