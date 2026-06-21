'use client';

import { EpisodeResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { m } from 'framer-motion';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa6';
import { cn } from '@/lib';

type EpisodeCardProps = {
  episode: EpisodeResType;
  index: number;
  toggle: boolean;
  isPlaying?: boolean;
  onClick: () => void;
};

export function EpisodeCard({
  episode,
  index,
  toggle,
  isPlaying = false,
  onClick
}: EpisodeCardProps) {
  return (
    <m.div
      layout
      transition={{
        layout: { duration: 0.15, ease: 'linear' }
      }}
      className='translate-z-0 will-change-transform'
    >
      <button
        onClick={onClick}
        className={cn(
          'group block w-full cursor-pointer transition-all duration-200 ease-linear',
          {
            'bg-charade hover:text-golden-glow max-640:h-10.5 flex h-12.5 items-center justify-center gap-2 rounded-sm px-[3.5px]':
              toggle,
            'bg-golden-glow hover:bg-golden-glow/80 text-black hover:text-black/80':
              isPlaying && toggle
          }
        )}
      >
        <m.div
          layout
          className={cn(
            'bg-gunmetal-blue relative mb-2.5 block w-full translate-z-0 overflow-hidden rounded-md will-change-transform',
            {
              'h-0 pb-[66%]': !toggle,
              'border-golden-glow border-2 border-solid': isPlaying && !toggle,
              hidden: toggle
            }
          )}
          transition={{
            duration: 0.15,
            ease: 'linear'
          }}
        >
          <div className='group-hover:text-golden-glow border-golden-glow absolute top-1/2 left-1/2 z-3 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid bg-[rgba(0,0,0,0.5)] opacity-0 transition-all duration-200 ease-linear group-hover:opacity-100'>
            <FaPlay />
          </div>
          {episode.thumbnailUrl ? (
            <Image
              src={renderImageUrl(episode.thumbnailUrl)}
              className='aspect-video h-full w-full border-none object-cover'
              alt={episode.title}
              fill
              sizes='(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1600px) 16vw, 12.5vw'
            />
          ) : (
            <Image
              src='/logo.webp'
              alt={episode.title}
              width={100}
              height={100}
              className='absolute top-1/2 left-1/2 m-auto -translate-x-1/2 -translate-y-1/2 object-cover'
            />
          )}
          {isPlaying && !toggle && (
            <div className='bg-golden-glow absolute bottom-0 left-0 rounded-tr-sm px-1.5 py-0.75 text-xs text-black'>
              Đang chiếu
            </div>
          )}
        </m.div>
        <div
          className={cn(
            'max-640:gap-1 max-640:text-[13px] max-520:text-xs group-hover:text-golden-glow flex items-center gap-2.5 text-sm font-medium transition-all duration-200 ease-linear',
            {
              'group-hover:text-black': isPlaying && toggle
            }
          )}
        >
          <div className='block shrink-0 text-xs'>
            <FaPlay />
          </div>
          <div className='line-clamp-1 block truncate'>Tập {index + 1}</div>
        </div>
      </button>
    </m.div>
  );
}
