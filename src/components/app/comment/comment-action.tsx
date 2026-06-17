import { DislikeIcon, LikeIcon } from '@/assets';
import { Activity } from '@/components/activity';
import {
  DATE_TIME_FORMAT,
  REACTION_TYPE_DISLIKE,
  REACTION_TYPE_LIKE
} from '@/constants';
import { cn } from '@/lib';
import { CommentResType } from '@/types';
import { convertUTCToLocal, timeAgo } from '@/utils';
import { AnimatePresence, m } from 'framer-motion';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  FaEllipsis,
  FaEye,
  FaEyeSlash,
  FaReply,
  FaTrash
} from 'react-icons/fa6';
import { ConfirmModal } from '@/components/modal';

type CommentActionProps = {
  comment: CommentResType;
  level: number;
  isAuthenticated: boolean;
  isAuthor: boolean;
  isVoteLoading: boolean;
  canViewHiddenContent: boolean;
  isVisible: boolean;
  showDropdown: boolean;
  showMore: boolean;
  voteMap: Record<string, number>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onVote: (id: string, type: number) => void;
  onReply: () => void;
  onEdit: () => void;
  onToggleDropdown: () => void;
  onViewContent: () => void;
  onDelete: () => void;
};

export function CommentAction({
  comment,
  level,
  isAuthenticated,
  isAuthor,
  isVoteLoading,
  canViewHiddenContent,
  isVisible,
  showDropdown,
  showMore,
  voteMap,
  dropdownRef,
  onVote,
  onReply,
  onEdit,
  onToggleDropdown,
  onViewContent,
  onDelete
}: CommentActionProps) {
  return (
    <div className='relative mt-3 flex items-center gap-4'>
      <div className='flex items-center gap-2'>
        <span
          title={convertUTCToLocal(comment.createdDate, DATE_TIME_FORMAT)}
          className='max-640:block max-640:min-w-6 max-640:text-[13px] max-520:text-xs hidden text-gray-400'
        >
          {timeAgo(comment.createdDate, true)}
        </span>
        <div className='flex items-center gap-4'>
          <div className='max-640:gap-1.5 flex items-center gap-2'>
            <LikeIcon
              size={16}
              onClick={() => onVote(comment.id, REACTION_TYPE_LIKE)}
              iconClassName={cn('transition-colors duration-200 ease-linear', {
                'hover:text-golden-glow': isAuthenticated && !isVoteLoading,
                'text-golden-glow': voteMap[comment.id] === REACTION_TYPE_LIKE
              })}
            />
            <span
              className={cn('max-640:hidden', {
                'max-640:block': voteMap[comment.id] === REACTION_TYPE_LIKE
              })}
            >
              {comment.totalLike}
            </span>
          </div>
          <div className='max-640:gap-1.5 flex items-center gap-2'>
            <DislikeIcon
              size={16}
              onClick={() => onVote(comment.id, REACTION_TYPE_DISLIKE)}
              iconClassName={cn('transition-colors duration-200 ease-linear', {
                'hover:text-red-beauty': isAuthenticated && !isVoteLoading,
                'text-red-beauty': voteMap[comment.id] === REACTION_TYPE_DISLIKE
              })}
            />
            <span
              className={cn('max-640:hidden', {
                'max-640:block': voteMap[comment.id] === REACTION_TYPE_DISLIKE
              })}
            >
              {comment.totalDislike}
            </span>
          </div>
        </div>
      </div>
      <Activity visible={isAuthenticated}>
        <button
          type='button'
          className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex cursor-pointer items-center gap-2 text-gray-400 transition-all duration-200 ease-linear select-none'
          onClick={onReply}
        >
          <FaReply />
          <span>Trả lời</span>
        </button>
      </Activity>
      <Activity visible={isAuthor && isAuthenticated}>
        <button
          type='button'
          className={cn(
            'hover:text-golden-glow max-640:text-[13px] max-520:text-xs max-420:hidden flex cursor-pointer items-center gap-2 text-gray-400 transition-all duration-200 ease-linear select-none',
            {
              'max-520:hidden': level > 0
            }
          )}
          onClick={onEdit}
        >
          <AiOutlineEdit />
          <span>Cập nhật</span>
        </button>
      </Activity>
      <div className='relative' ref={dropdownRef}>
        {showMore && (
          <button
            type='button'
            className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex cursor-pointer items-center gap-1 text-gray-400 transition-all duration-200 ease-linear select-none'
            onClick={onToggleDropdown}
          >
            <FaEllipsis /> <span>Thêm</span>
          </button>
        )}

        <AnimatePresence>
          {showDropdown && (
            <m.div
              initial={{
                opacity: 0,
                scale: 0.8
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
              className={cn(
                'max-640:min-w-36 absolute top-5 -left-5 z-10 min-w-40 origin-[20px_-50%] overflow-hidden rounded-lg bg-gray-100 py-1 shadow-lg',
                {
                  'max-420:-left-12.5 max-420:origin-[40px_-50%] max-480:-left-10 max-480:origin-[40px_-50%]':
                    level === 0,
                  'max-480:-left-7.5 max-480:origin-[30px_-50%] max-420:-left-[70px] max-420:origin-[80px_-50%]':
                    level > 0
                }
              )}
            >
              <Activity visible={isAuthor && isAuthenticated}>
                <button
                  type='button'
                  className={cn(
                    'max-640:text-[13px] max-520:text-xs w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80',
                    {
                      'max-420:flex hidden': level === 0,
                      '520:hidden flex': level > 0
                    }
                  )}
                  onClick={onEdit}
                >
                  <AiOutlineEdit />
                  <span>Cập nhật</span>
                </button>
              </Activity>
              {canViewHiddenContent && (
                <button
                  className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                  onClick={onViewContent}
                >
                  {isVisible ? (
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
                <ConfirmModal
                  message='Bạn có chắc chắn muốn xóa bình luận này không?'
                  onConfirm={onDelete}
                  trigger={
                    <button
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-rose-500'
                      type='button'
                    >
                      <FaTrash />
                      Xóa bình luận
                    </button>
                  }
                />
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
