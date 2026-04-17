'use client';

import { renderImageUrl } from '@/utils';
import Image from 'next/image';
import { m } from 'framer-motion';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { cn } from '@/lib';
import Tilt from 'react-parallax-tilt';
import { SurveyResType } from '@/types';

type SurveyCardProps = {
  movie: SurveyResType;
  isSelected: boolean;
  onClickAction: (movie: SurveyResType) => void;
};

export default function SurveyCard({
  movie,
  isSelected,
  onClickAction
}: SurveyCardProps) {
  return (
    <Tilt
      scale={1.1}
      glareEnable={true}
      glareMaxOpacity={0.8}
      glareColor='var(--color-charade)'
      glarePosition='all'
      glareBorderRadius='8px'
      className='hover:z-20'
      transitionSpeed={1500}
    >
      <m.div
        className='relative h-0 cursor-pointer pb-[150%]'
        whileTap={{
          scale: 0.98
        }}
        onClick={() => onClickAction(movie)}
      >
        <div
          className={cn(
            'flex-center absolute inset-0 z-10 transition-all duration-200 ease-linear',
            {
              'bg-black/50': isSelected,
              'bg-transparent': !isSelected
            }
          )}
        >
          <IoMdCheckmarkCircleOutline
            className={cn(
              'size-18 text-white transition-all duration-200 ease-in-out',
              {
                'opacity-100': isSelected,
                'opacity-0': !isSelected
              }
            )}
          />
        </div>
        <Image
          src={renderImageUrl(movie.posterUrl)}
          alt={movie.title}
          fill
          unoptimized
          className='absolute inset-0 size-full rounded-md object-cover select-none'
        />
      </m.div>
    </Tilt>
  );
}
