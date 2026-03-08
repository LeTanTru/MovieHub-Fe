'use client';

import {
  ButtonDeletePlaylist,
  ButtonEditPlaylist
} from '@/components/app/button-playlist';
import { Separator } from '@/components/ui/separator';
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
        'cursor-pointer rounded-md border-2 p-4 shadow-[inset_0_0_0_3px_#ffffff03] transition-all duration-200 ease-linear',
        {
          'border-golden-glow': selectedPlaylist?.id === playlist.id
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
        <div className='flex gap-3'>
          <ButtonEditPlaylist playlist={playlist} />
          <Separator orientation='vertical' className='h-4! bg-white/20' />
          <ButtonDeletePlaylist id={playlist.id} />
        </div>
      </div>
    </div>
  );
}
