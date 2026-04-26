import { cn } from '@/lib';
import { EpisodeResType } from '@/types';
import Image from 'next/image';
import { renderImageUrl } from '@/utils';
import Link from 'next/link';

type EpisodeItemProps = {
  episode: EpisodeResType;
  watchUrl: string;
  selectedSeason: string;
  currentEpisode?: string;
  onClick?: () => void;
};

export default function EpisodeItem({
  episode,
  watchUrl,
  selectedSeason,
  currentEpisode,
  onClick
}: EpisodeItemProps) {
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
