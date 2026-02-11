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
  REACTION_TYPE_DISLIKE,
  REACTION_TYPE_LIKE
} from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { ReviewResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useState } from 'react';
import { FaEllipsis, FaTrash } from 'react-icons/fa6';
import { Activity } from '@/components/activity';

export default function ReviewItem({
  review,
  reviewRatingMaps,
  isAuthor,
  isAuthenticated,
  isVoteLoading,
  voteType,
  onLike,
  onDislike,
  onDelete
}: {
  review: ReviewResType;
  reviewRatingMaps: Record<number, { label: string; icon: StaticImageData }>;
  isAuthor: boolean;
  isAuthenticated: boolean;
  isVoteLoading: boolean;
  voteType: number;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const author = review.author;
  const gender = author?.gender || GENDER_OTHER;
  const kind = author?.kind !== undefined ? kindMaps[author.kind] : undefined;
  const rate = review.rate;
  const ratingInfo = rate !== undefined ? reviewRatingMaps[rate] : null;
  const GenderIcon = genderIconMaps[gender];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const handleDropdownToggle = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  return (
    <div className='flex-start relative flex gap-4'>
      <AvatarField
        src={renderImageUrl(author?.avatarPath)}
        size={50}
        alt={author?.fullName || 'User'}
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
            {ratingInfo && (
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
            )}
            <span>
              {review.author.fullName}
              &nbsp;
              <span
                className={cn({
                  'text-light-golden-yellow -ml font-semibold': isAuthor
                })}
              >
                {isAuthor && '(Bạn)'}
              </span>
            </span>

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
        <div className='break-all text-gray-400'>{review.content}</div>
        <div className='relative mt-2 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <LikeIcon
                size={16}
                onClick={() => onLike(review.id)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-light-golden-yellow':
                      isAuthenticated && !isVoteLoading,
                    'text-light-golden-yellow': voteType === REACTION_TYPE_LIKE
                  }
                )}
              />
              {review.totalLike}
            </div>
            <div className='flex items-center gap-2'>
              <DislikeIcon
                size={16}
                onClick={() => onDislike(review.id)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-dislike-comment':
                      isAuthenticated && !isVoteLoading,
                    'text-dislike-comment': voteType === REACTION_TYPE_DISLIKE
                  }
                )}
              />
              {review.totalDislike}
            </div>
          </div>
          <Activity visible={!!isAuthor}>
            <div className='relative' ref={dropdownRef}>
              <button
                type='button'
                className='flex items-center gap-1 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
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
                    className='absolute top-5 z-10 min-w-40 overflow-hidden rounded-lg bg-gray-100 py-2 shadow-lg'
                  >
                    <button
                      className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                      onClick={() => {
                        setShowDropdown(false);
                        onDelete(review.id);
                      }}
                    >
                      <FaTrash />
                      Xoá đánh giá
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Activity>
        </div>
      </div>
    </div>
  );
}
