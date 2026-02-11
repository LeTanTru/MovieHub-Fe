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
import { AuthorInfo, CommentResType } from '@/types';
import { convertUTCToLocal, renderImageUrl, timeAgo } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { FaEllipsis, FaReply, FaTrash } from 'react-icons/fa6';
import { Activity } from '@/components/activity';

export default function CommentItem({
  comment,
  userId,
  isAuthenticated,
  isVoteLoading,
  voteType,
  onLike,
  onDislike,
  onDelete
}: {
  comment: CommentResType;
  userId: string;
  isAuthenticated: boolean;
  isVoteLoading: boolean;
  voteType: number;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const authorInfo: AuthorInfo = JSON.parse(comment.authorInfo || '{}');
  const isAuthor = userId && authorInfo.id ? userId === authorInfo.id : false;
  const gender = authorInfo.gender || GENDER_OTHER;
  const kind =
    authorInfo.kind !== undefined ? kindMaps[authorInfo.kind] : undefined;
  const GenderIcon = genderIconMaps[gender];

  const movieItem = comment.movieItem;

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
        src={renderImageUrl(authorInfo.avatarPath)}
        size={50}
        alt={authorInfo.fullName}
      />
      <div className='grow'>
        <div className='flex-start relative mb-2 flex items-center gap-2.5'>
          <div className='flex items-center gap-x-2'>
            {kind && (
              <Badge
                variant='outline'
                className={cn('border text-sm font-medium', kind.style)}
              >
                {kind.label}
              </Badge>
            )}
            <span
              className={cn({
                'text-light-golden-yellow font-semibold': isAuthor
              })}
            >
              {authorInfo.fullName} {isAuthor && '(Bạn)'}
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
            title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
            className='text-xs text-gray-400'
          >
            {timeAgo(comment.createdDate)}
          </span>
          {movieItem && (
            <Badge
              variant='outline'
              className='border px-2 py-1 text-xs font-medium text-gray-400'
            >
              P. {movieItem.parent.label} - Tập {movieItem.label}
            </Badge>
          )}
        </div>
        <div className='text-gray-400'>{comment.content}</div>
        <div className='relative mt-2 flex items-center gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <LikeIcon
                size={16}
                onClick={() => onLike(comment.id)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-light-golden-yellow':
                      isAuthenticated && !isVoteLoading,
                    'text-light-golden-yellow': voteType === REACTION_TYPE_LIKE
                  }
                )}
              />
              {comment.totalLike}
            </div>
            <div className='flex items-center gap-2'>
              <DislikeIcon
                size={16}
                onClick={() => onDislike(comment.id)}
                iconClassName={cn(
                  'transition-colors duration-200 ease-linear',
                  {
                    'hover:text-dislike-comment':
                      isAuthenticated && !isVoteLoading,
                    'text-dislike-comment': voteType === REACTION_TYPE_DISLIKE
                  }
                )}
              />
              {comment.totalDislike}
            </div>
          </div>
          <button
            type='button'
            className='flex gap-2 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
          >
            <FaReply />
            <span>Trả lời</span>
          </button>
          <Activity visible={!!isAuthor}>
            <div className='relative' ref={dropdownRef}>
              <button
                type='button'
                className='flex gap-2 font-light opacity-50 transition-opacity duration-200 ease-linear select-none hover:opacity-100'
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
                        onDelete(comment.id);
                      }}
                    >
                      <FaTrash />
                      Xoá bình luận
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
