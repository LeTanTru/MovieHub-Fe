'use client';

import { DislikeIcon, LikeIcon } from '@/assets';
import { AvatarField } from '@/components/form';
import { Badge } from '@/components/ui/badge';
import {
  DATE_TIME_FORMAT,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  genderIconMaps,
  kindMaps,
  reviewRatings
} from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { ReviewResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useMemo, useState } from 'react';
import { FaEllipsis, FaEye, FaFlag, FaReply } from 'react-icons/fa6';

export default function ReviewItem({ review }: { review: ReviewResType }) {
  const author = review.author;
  const gender = author.gender || GENDER_OTHER;
  const kind = kindMaps[author.kind];
  const rate = review.rate;

  const GenderIcon = genderIconMaps[gender];

  const reviewRatingMaps: Record<
    number,
    { label: string; icon: StaticImageData }
  > = useMemo(() => {
    return reviewRatings.reduce(
      (acc, curr) => {
        acc[curr.value as number] = { label: curr.label, icon: curr.icon };
        return acc;
      },
      {} as Record<number, { label: string; icon: StaticImageData }>
    );
  }, []);

  const ratingInfo = reviewRatingMaps[rate];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className='flex-start relative flex gap-4'>
      <AvatarField
        src={renderImageUrl(author.avatarPath)}
        size={50}
        alt={author.fullName}
      />
      <div className='grow'>
        <div className='flex-start relative mb-2 flex items-center gap-2.5'>
          <div className='flex items-center gap-x-2'>
            {kind && (
              <Badge
                variant='outline'
                className={cn(`border text-sm font-medium ${kind.style}`)}
              >
                {kind.label}
              </Badge>
            )}
            <div className='bg-review flex items-center gap-2 rounded-lg py-1.25 pr-2.5 pl-1.25 leading-1 text-white'>
              <Image
                src={ratingInfo.icon}
                alt={ratingInfo.label}
                width={16}
                height={16}
                unoptimized
              />
              <span className='text-xs'>{ratingInfo.label}</span>
            </div>
            <span>{author.fullName}</span>
            <GenderIcon
              className={cn('size-4', {
                'text-cyan-500': gender === GENDER_MALE,
                'text-pink-500': gender === GENDER_FEMALE,
                'text-light-golden-yellow': gender === GENDER_OTHER
              })}
            />
          </div>
          <span
            title={convertUTCToLocal(review.createdDate, DATE_TIME_FORMAT)}
            className='text-xs text-gray-400'
          >
            {timeAgo(review.createdDate)}
          </span>
        </div>
        <div className='text-gray-400'>{review.content}</div>
        <div className='relative mt-2 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <LikeIcon
              size={16}
              className='hover:text-light-golden-yellow transition-colors duration-200'
            />
            <DislikeIcon
              size={16}
              className='hover:text-dislike-comment transition-colors duration-200'
            />
          </div>
          <button
            type='button'
            className='flex gap-2 text-xs font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
          >
            <FaReply />
            <span>Trả lời</span>
          </button>
          <div className='relative' ref={dropdownRef}>
            <button
              type='button'
              className='flex gap-2 text-xs font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
              onClick={handleDropdownToggle}
            >
              <FaEllipsis /> <span>Thêm</span>
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    transformOrigin: '0% -50%'
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8
                  }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                  className='absolute top-5 z-10 min-w-40 overflow-hidden rounded-lg bg-gray-100 shadow-lg'
                >
                  <div
                    className='flex cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaEye />
                    Thêm 1
                  </div>
                  <div
                    className='flex cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaFlag />
                    Thêm 2
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
