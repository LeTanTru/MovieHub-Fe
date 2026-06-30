'use client';

import {
  ButtonDeletePlaylist,
  ButtonEditPlaylist
} from '@/components/app/button-playlist';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib';
import { useSelectedPlaylist } from '@/hooks';
import { PlaylistResType } from '@/types';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { m } from 'framer-motion';

type PlaylistCardProps = {
  playlist: PlaylistResType;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { selectedPlaylist, setSelectedPlaylist } = useSelectedPlaylist();

  const handleSelectPlaylist = () => {
    setSelectedPlaylist(playlist);
  };

  return (
    <m.div
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
      whileTap={{
        scale: 0.95
      }}
      whileHover={{
        y: -10
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
    </m.div>
  );
}

PlaylistCard.Skeleton = function PlaylistCardSkeleton() {
  return (
    <div className='max-520:w-50 max-520:shrink-0 rounded-md border-2 p-4 shadow-[inset_0_0_0_3px_#ffffff03]'>
      <Skeleton className='skeleton mb-4 h-5 w-3/4 rounded!' />
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Skeleton className='skeleton size-5 rounded-full!' />
          <Skeleton className='skeleton h-5 w-12 rounded!' />
        </div>
        <div></div>
      </div>
    </div>
  );
};
