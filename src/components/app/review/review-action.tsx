import { DislikeIcon, LikeIcon } from '@/assets';
import { ConfirmModal } from '@/components/modal';
import { REACTION_TYPE_DISLIKE, REACTION_TYPE_LIKE } from '@/constants';
import { cn } from '@/lib';
import { ReviewResType } from '@/types';
import { AnimatePresence, m } from 'framer-motion';
import { Flag } from 'lucide-react';
import { FaEllipsis, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa6';

type ReviewActionProps = {
  review: ReviewResType;
  isHidden: boolean;
  canDelete: boolean;
  canReport: boolean;
  canVote: boolean;
  isVisible: boolean;
  showDropdown: boolean;
  voteType: number;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onVote: (id: string, type: number) => void;
  onToggleDropdown: () => void;
  onToggleBlurredContent: () => void;
  onDelete: () => void;
  onOpenReportModal: () => void;
};

export function ReviewAction({
  review,
  isHidden,
  canDelete,
  canReport,
  canVote,
  isVisible,
  showDropdown,
  voteType,
  dropdownRef,
  onVote,
  onToggleDropdown,
  onToggleBlurredContent,
  onDelete,
  onOpenReportModal
}: ReviewActionProps) {
  const showMore = isHidden || canDelete || canReport;

  return (
    <div className='max-640:mt-3 max-640:gap-3 max-480:gap-2.5 relative mt-4 flex items-center gap-4'>
      <div className='flex items-center gap-2'>
        <div className='max-640:gap-3 max-480:gap-2.5 flex items-center gap-4'>
          <div className='max-640:gap-1.5 flex items-center gap-2'>
            <LikeIcon
              size={16}
              onClick={() => onVote(review.id, REACTION_TYPE_LIKE)}
              iconClassName={cn('transition-colors duration-200 ease-linear', {
                'hover:text-golden-glow': canVote,
                'text-golden-glow': voteType === REACTION_TYPE_LIKE
              })}
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
              onClick={() => onVote(review.id, REACTION_TYPE_DISLIKE)}
              iconClassName={cn('transition-colors duration-200 ease-linear', {
                'hover:text-red-beauty': canVote,
                'text-red-beauty': voteType === REACTION_TYPE_DISLIKE
              })}
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
              {isHidden && (
                <button
                  type='button'
                  className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                  onClick={onToggleBlurredContent}
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
              {canDelete && (
                <ConfirmModal
                  message='Bạn có chắc chắn muốn xóa đánh giá này không?'
                  onConfirm={onDelete}
                  trigger={
                    <button
                      className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-rose-500'
                      type='button'
                    >
                      <FaTrash />
                      Xóa đánh giá
                    </button>
                  }
                />
              )}
              {canReport && (
                <button
                  type='button'
                  className='max-640:text-[13px] max-520:text-xs flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-gray-300 hover:text-black/80'
                  onClick={onOpenReportModal}
                >
                  <Flag className='size-4 fill-black' />
                  <span>Báo cáo</span>
                </button>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
