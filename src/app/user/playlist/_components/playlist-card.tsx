'use client';

import {
  ButtonDeletePlaylist,
  ButtonEditPlaylist
} from '@/components/app/button-playlist';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib';
import { useSelectedPlaylist } from '@/hooks';
import { PlaylistResType } from '@/types';
import { FaRegCirclePlay } from 'react-icons/fa6';

type PlaylistCardProps = {
  playlist: PlaylistResType;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { selectedPlaylist, setSelectedPlaylist } = useSelectedPlaylist();

  const handleSelectPlaylist = () => {
    setSelectedPlaylist(playlist);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={cn(
        'max-520:w-50 max-520:shrink-0 cursor-pointer rounded-md border-2 p-4 shadow-[inset_0_0_0_3px_#ffffff03] transition-all duration-200 ease-linear',
        {
          'border-golden-glow': selectedPlaylist?.id === playlist.id
        }
      )}
      onClick={handleSelectPlaylist}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelectPlaylist();
        }
      }}
    >
      <h3 className='max-520:mb-2 mb-4 font-semibold'>{playlist.name}</h3>
      <div className='flex items-center justify-between'>
        <div className='max-520:gap-x-1 max-520:text-[13px] flex items-center gap-x-2'>
          <FaRegCirclePlay />
          {playlist.totalMovie} phim
        </div>
        <div className='max-520:gap-3 flex gap-4'>
          <ButtonEditPlaylist playlist={playlist} />
          <Separator orientation='vertical' className='h-4! bg-white/20' />
          <ButtonDeletePlaylist id={playlist.id} />
        </div>
      </div>
    </div>
  );
}

PlaylistCard.Skeleton = function () {
  return (
    <div className='max-520:w-50 max-520:shrink-0 rounded-md border-2 p-4'>
      <div className='skeleton mb-4 h-5 w-20 rounded'></div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <div className='skeleton size-5 rounded-full'></div>
          <div className='skeleton h-5 w-12 rounded'></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
