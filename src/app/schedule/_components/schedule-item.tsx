'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { route } from '@/routes';
import type { MovieScheduleResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type ScheduleItemProps = {
  schedule: MovieScheduleResType;
};

const MotionLink = m.create(Link);

export function ScheduleItem({ schedule }: ScheduleItemProps) {
  return (
    <MotionLink
      href={`${route.movie.path}/${schedule.movie.slug}.${schedule.movie.id}`}
      className='hover:border-golden-glow relative flex items-center justify-between gap-4 rounded-[12px] border border-solid border-[#ffffff20] bg-[#363840] p-2.5 transition-all duration-200 ease-linear'
      whileHover={{
        y: -10
      }}
      whileTap={{
        scale: 0.95
      }}
    >
      <div className='w-12.5 shrink-0'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-sm pb-[150%]'>
          <Image
            src={renderImageUrl(schedule.movie.posterUrl)}
            alt={`${schedule.movie.title} - ${schedule.movie.originalTitle}`}
            className='absolute inset-0 size-full object-cover'
            width={50}
            height={75}
            loading='lazy'
            decoding='async'
            unoptimized
          />
        </div>
      </div>
      <div className='grow'>
        <h4 className='mb-1 text-white'>{schedule.movie.title}</h4>
        <span
          className='text-dark-gray line-clamp-2 text-xs'
          title={`Tập ${schedule.label} - ${schedule.title}`}
        >
          Tập {schedule.label}: {schedule.title}
        </span>
      </div>
    </MotionLink>
  );
}

ScheduleItem.Skeleton = function () {
  return (
    <div className='relative flex items-center justify-between gap-4 rounded-[12px] border border-solid border-[#ffffff20] bg-[#363840] p-2.5'>
      <div className='w-12.5 shrink-0'>
        <Skeleton className='h-0 w-full rounded-sm pb-[150%]' />
      </div>
      <div className='grow'>
        <Skeleton className='mb-2 h-4 w-3/4 rounded' />
        <Skeleton className='h-3 w-full rounded' />
        <Skeleton className='mt-1 h-3 w-1/2 rounded' />
      </div>
    </div>
  );
};
