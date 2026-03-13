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
  REACTION_TYPE_LIKE,
  STATUS_HIDE
} from '@/constants';
import { useClickOutside } from '@/hooks';
import { cn } from '@/lib';
import { ReviewResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { FaEllipsis, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa6';

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

  const isHiddenReview = review.status === STATUS_HIDE;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showBlurredContent, setShowBlurredContent] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleToggleBlurredContent = () => {
    setShowBlurredContent((prev) => !prev);
    setShowDropdown(false);
  };

  return (
    <div className='max-640:gap-3 max-520:gap-2 relative flex justify-start gap-4'>
      <AvatarField
        src={renderImageUrl(author?.avatarPath)}
        size={45}
        alt={author?.fullName}
        breakpoints={[{ breakpoint: 640, size: 50 }]}
      />
      <div className='grow'>
        <div className='relative flex items-center justify-start gap-2'>
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
                {review.author.fullName}
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
        <div
          className={cn(
            'max-640:text-[13px] relative mt-2 break-all text-white',
            {
              'cursor-pointer': isHiddenReview && !showBlurredContent
            }
          )}
          onClick={
            isHiddenReview && !showBlurredContent
              ? handleToggleBlurredContent
              : undefined
          }
        >
          <div
            className={cn({
              'max-640:text-[13px] blur-xs select-none':
                isHiddenReview && !showBlurredContent
            })}
          >
            {review.content}
          </div>
        </div>
        <div className='max-640:mt-3 relative mt-4 flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-4'>
              <div className='max-640:gap-1.5 flex items-center gap-2'>
                <LikeIcon
                  size={16}
                  onClick={() => onLike(review.id)}
                  iconClassName={cn(
                    'transition-colors duration-200 ease-linear',
                    {
                      'hover:text-golden-glow':
                        isAuthenticated && !isVoteLoading,
                      'text-golden-glow': voteType === REACTION_TYPE_LIKE
                    }
                  )}
                />
                <span
                  className={cn('max-640:hidden', {
                    'max-640:block': voteType === REACTION_TYPE_LIKE
                  })}
                >
                  {review.totalLike}
                </span>
              </div>
              <div className='max-640:gap-1.5 flex items-center gap-2'>
                <DislikeIcon
                  size={16}
                  onClick={() => onDislike(review.id)}
                  iconClassName={cn(
                    'transition-colors duration-200 ease-linear',
                    {
                      'hover:text-red-beauty':
                        isAuthenticated && !isVoteLoading,
                      'text-red-beauty': voteType === REACTION_TYPE_DISLIKE
                    }
                  )}
                />
                <span
                  className={cn('max-640:hidden', {
                    'max-640:block': voteType === REACTION_TYPE_DISLIKE
                  })}
                >
                  {review.totalDislike}
                </span>
              </div>
            </div>
          </div>
          <div className='relative' ref={dropdownRef}>
            {(isAuthor || isHiddenReview) && (
              <button
                type='button'
                className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex cursor-pointer items-center gap-1 text-gray-400 transition-all duration-200 ease-linear select-none'
                onClick={handleDropdownToggle}
              >
                <FaEllipsis /> <span>Thêm</span>
              </button>
            )}
            <AnimatePresence>
              {showDropdown && (
                <m.div
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
                  className='max-640:min-w-36 absolute top-5 -left-5 z-10 min-w-40 origin-[10px_-50%] overflow-hidden rounded-lg bg-gray-100 py-1 shadow-lg'
                >
                  {isHiddenReview && (
                    <button
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                      onClick={handleToggleBlurredContent}
                    >
                      {showBlurredContent ? (
                        <>
                          <FaEyeSlash />
                          Ẩn nội dung
                        </>
                      ) : (
                        <>
                          <FaEye />
                          Xem nội dung
                        </>
                      )}
                    </button>
                  )}
                  {isAuthor && (
                    <button
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-red-500'
                      onClick={() => {
                        setShowDropdown(false);
                        onDelete(review.id);
                      }}
                    >
                      <FaTrash />
                      Xoá đánh giá
                    </button>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
