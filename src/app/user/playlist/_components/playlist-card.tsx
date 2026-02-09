'use client';

import {
  ButtonDeletePlaylist,
  ButtonEditPlaylist
} from '@/components/app/button-action-playlist';
import { PlaylistResType } from '@/types';
import { FaRegCirclePlay } from 'react-icons/fa6';

export default function PlaylistCard({
  playlist
}: {
  playlist: PlaylistResType;
}) {
  return (
    <div className='rounded-xl border p-4'>
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
