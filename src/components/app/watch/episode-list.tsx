'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { EpisodeResType, SeasonResType } from '@/types';
import { X } from 'lucide-react';
import { useState } from 'react';
import { FaBarsStaggered, FaCaretDown } from 'react-icons/fa6';
import { AnimatePresence, m } from 'framer-motion';
import { useClickOutside, useQueryParams } from '@/hooks';
import Image from 'next/image';
import { renderImageUrl } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function EpisodeItem({
  episode,
  watchUrl,
  selectedSeason,
  currentEpisode,
  onClick
}: {
  episode: EpisodeResType;
  watchUrl: string;
  selectedSeason: string;
  currentEpisode?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`${watchUrl}?season=${selectedSeason}&episode=${episode.label}`}
      className={cn(
        'hover:text-golden-glow block px-4 py-2 transition-colors duration-200 ease-linear hover:bg-white/10',
        {
          'text-golden-glow bg-white/10': currentEpisode === episode.label
        }
      )}
      onClick={onClick}
    >
      <div className='relative flex w-full items-center gap-2 overflow-hidden'>
        {episode.thumbnailUrl && (
          <Image
            src={renderImageUrl(episode.thumbnailUrl)}
            width={100}
            height={100}
            alt={`Episode ${episode.label}. ${episode.title}`}
            className='aspect-video rounded'
          />
        )}
        <h3
          className='line-clamp-2'
          title={`Tập ${episode.label}. ${episode.title}`}
        >
          Tập {episode.label}.&nbsp;{episode.title}
        </h3>
      </div>
    </Link>
  );
}

export default function EpisodeList({
  isOpen = false,
  onToggle,
  seasons
}: {
  isOpen?: boolean;
  onToggle?: () => void;
  seasons: SeasonResType[];
}) {
  const pathname = usePathname();
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();
  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const [selectedSeason, setSelectedSeason] = useState<string | number>(
    currentSeason || seasons.length
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const seasonCount = seasons.length;

  const season = seasons.find((s) => s.label === selectedSeason.toString());

  const seasonIndices = Array.from(
    { length: seasonCount },
    (_, index) => index + 1
  );

  const handleSelectSeason = (seasonLabel: string | number) => {
    setSelectedSeason(seasonLabel);
    setShowDropdown(false);
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <>
      <div
        className={cn(
          `episode-sidebar bg-dark-gunmetal-gray absolute top-0 right-0 z-30 flex h-full w-100 transform flex-col shadow-lg transition-transform duration-200 ease-linear`,
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen
          }
        )}
      >
        <div className='flex items-center justify-between px-4 py-3'>
          <h3 className='font-medium text-white'>Danh sách tập</h3>
          <Button
            variant='ghost'
            className='rounded-full p-0 text-gray-400 hover:bg-transparent hover:text-white'
            onClick={onToggle}
          >
            <span>
              <X />
            </span>
          </Button>
        </div>
        <div className='relative px-4 py-2' ref={dropdownRef}>
          <div
            className='flex max-w-30 cursor-pointer items-center justify-start gap-2.5 rounded border border-solid border-white p-2 text-white transition-all duration-200 ease-linear select-none hover:opacity-80'
            onClick={handleDropdownToggle}
          >
            <FaBarsStaggered />
            Phần {selectedSeason}
            <FaCaretDown />
          </div>
          <AnimatePresence>
            {showDropdown && (
              <m.div
                initial={{
                  opacity: 0.5,
                  scale: 0.8,
                  transformOrigin: '30% 0%'
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0.5,
                  scale: 0.8
                }}
                transition={{ duration: 0.05, ease: 'linear' }}
                className='absolute top-12 z-10 min-w-40 overflow-hidden rounded-sm bg-white/10 py-2 shadow-[0px_0px_10px_2px_var(--gray-200)] backdrop-blur-xs'
              >
                {seasonIndices.map((seasonIndex) => (
                  <div
                    key={`season-${seasonIndex}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 leading-6 text-white transition-all duration-200 ease-linear hover:bg-white/20',
                      {
                        'text-golden-glow bg-white/25 font-semibold':
                          seasonIndex.toString() === selectedSeason.toString()
                      }
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSeason(seasonIndex);
                    }}
                  >
                    Phần {seasonIndex}
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </div>
        <div className='min-h-0 flex-1 overflow-auto'>
          {season?.episodes.map((episode) => (
            <EpisodeItem
              key={episode.id}
              episode={episode}
              selectedSeason={selectedSeason as string}
              currentEpisode={currentEpisode}
              watchUrl={pathname}
              onClick={onToggle}
            />
          ))}
        </div>
      </div>

      <div
        className={cn(
          `episode-sidebar-backdrop absolute top-0 left-0 z-20 h-full w-full cursor-pointer bg-black/50 transition-opacity duration-300 ease-linear`,
          {
            'opacity-100': isOpen,
            'pointer-events-none opacity-0': !isOpen
          }
        )}
        onClick={onToggle}
      />
    </>
  );
}
