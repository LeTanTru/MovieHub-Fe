import { Badge } from '@/components/ui/badge';
import {
  DATE_TIME_FORMAT,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER
} from '@/constants';
import { cn } from '@/lib';
import { ProfileResType, ReviewResType } from '@/types';
import { convertUTCToLocal, timeAgo } from '@/utils';
import Image, { StaticImageData } from 'next/image';
import { ComponentType } from 'react';

type ReviewHeaderProps = {
  review: ReviewResType;
  isAuthor: boolean;
  kind:
    | {
        label: string;
        style: string;
      }
    | undefined;
  gender: number;
  GenderIcon: ComponentType<{ className?: string }>;
  author: ProfileResType;
  ratingInfo: { label: string; icon: StaticImageData } | null;
};

export function ReviewHeader({
  review,
  isAuthor,
  kind,
  gender,
  GenderIcon,
  author,
  ratingInfo
}: ReviewHeaderProps) {
  return (
    <div className='relative flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5'>
      <div className='flex items-center gap-x-2'>
        {kind && (
          <Badge
            variant='outline'
            className={cn(
              'max-640:text-xs max-520:text-[10px] max-640:px-1 border text-sm font-medium uppercase',
              kind.style
            )}
          >
            {kind.label}
          </Badge>
        )}
        {ratingInfo && (
          <div className='bg-dark-conflower-blue max-640:py-1 max-640:px-1.5 max-520:py-1 max-520:px-1.5 flex shrink-0 items-center gap-2 rounded-lg py-1.25 pr-2.5 pl-1.25 leading-1 whitespace-nowrap text-white'>
            <Image
              src={ratingInfo.icon}
              alt={ratingInfo.label}
              width={16}
              height={16}
              unoptimized
            />
            <span className='max-640:text-[10px] max-520:text-[10px] text-xs'>
              {ratingInfo.label}
            </span>
          </div>
        )}
        <div className='max-640:text-[13px] flex items-center'>
          <span className='max-990:max-w-100 max-800:max-w-80 max-720:max-w-65 max-640:max-w-55 max-480:max-w-45 max-420:max-w-30 line-clamp-1 block max-w-125 truncate'>
            {author.fullName}
          </span>
          {isAuthor && (
            <span className='max-640:hidden text-golden-glow font-semibold'>
              &nbsp;(Bạn)
            </span>
          )}
        </div>

        <GenderIcon
          className={cn('max-640:size-3 size-4 shrink-0', {
            'text-cyan-500': gender === GENDER_MALE,
            'text-pink-500': gender === GENDER_FEMALE,
            'text-golden-glow': gender === GENDER_OTHER
          })}
        />
      </div>
      <span
        title={convertUTCToLocal(review.createdDate, DATE_TIME_FORMAT)}
        className='max-640:text-[13px] max-520:text-xs whitespace-nowrap text-gray-400'
      >
        <span className='max-640:hidden block'>
          {timeAgo(review.createdDate)}
        </span>
        <span className='max-640:block hidden'>
          {timeAgo(review.createdDate, true)}
        </span>
      </span>
    </div>
  );
}
