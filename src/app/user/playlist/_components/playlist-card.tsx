'use client';

import {
  ButtonDeletePlaylist,
  ButtonEditPlaylist
} from '@/components/app/button-action-playlist';
import { cn } from '@/lib';
import { usePlaylistStore } from '@/store';
import { PlaylistResType } from '@/types';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { useShallow } from 'zustand/shallow';

export default function PlaylistCard({
  playlist
}: {
  playlist: PlaylistResType;
}) {
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );

  const handleSelectPlaylist = () => {
    setSelectedPlaylist(playlist);
  };

  return (
    <div
      className={cn(
        'cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ease-linear',
        {
          'border-light-golden-yellow': selectedPlaylist?.id === playlist.id
        }
      )}
      onClick={handleSelectPlaylist}
    >
      <h3 className='mb-4 font-semibold'>{playlist.name}</h3>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <FaRegCirclePlay />
          {playlist.totalMovie} phim
        </div>
        <div className='flex gap-4'>
          <ButtonEditPlaylist playlist={playlist} />
          <ButtonDeletePlaylist id={playlist.id} />
        </div>
      </div>
    </div>
  );
}
