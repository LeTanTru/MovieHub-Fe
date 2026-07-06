import { Button } from '@/components/form';
import { VerticalBarLoading } from '@/components/loading';
import type { CommentResType } from '@/types';
import { AnimatePresence, m } from 'framer-motion';
import { ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const REPLY_CHILD_MARGIN_LEFT = 40;

type CommentReplyListProps = {
  comment: CommentResType;
  level: number;
  rootId: string;
  isActiveParent: boolean;
  commentList: CommentResType[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreComments: boolean;
  onViewReplies: () => void;
  onHideReplies: () => void;
  onLoadMore: () => void;
  renderChildren: (
    list: CommentResType[],
    level: number,
    rootId?: string
  ) => ReactNode;
};

export function CommentReplyList({
  comment,
  level,
  rootId,
  isActiveParent,
  commentList,
  isLoading,
  isLoadingMore,
  hasMoreComments,
  onViewReplies,
  onHideReplies,
  onLoadMore,
  renderChildren
}: CommentReplyListProps) {
  return (
    <>
      <AnimatePresence initial={false}>
        {isActiveParent && commentList.length > 0 && (
          <m.div
            key='replies-container'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
          >
            <div className='mt-4 flex flex-col gap-4'>
              {renderChildren(commentList, level + 1, rootId)}
            </div>
            {isLoadingMore && <VerticalBarLoading className='py-10' />}
          </m.div>
        )}
      </AnimatePresence>

      {comment.totalChildren > 0 &&
        (!isActiveParent ? (
          <button
            className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs mt-4 flex cursor-pointer items-center gap-2 transition-colors duration-200 ease-linear'
            onClick={onViewReplies}
            type='button'
          >
            <FaChevronDown /> Xem tất cả&nbsp;{comment.totalChildren} trả lời
          </button>
        ) : isLoading ? (
          <VerticalBarLoading className='py-10' />
        ) : (
          <div
            className='max-640:ml-0! max-640:mt-2 mt-4 flex items-center gap-4'
            style={{ marginLeft: level * REPLY_CHILD_MARGIN_LEFT }}
          >
            {hasMoreComments && (
              <Button
                variant='ghost'
                type='button'
                className='hover:text-golden-glow max-640:text-[13px] max-520:text-xs flex h-5! items-center p-0! font-medium hover:bg-transparent'
                onClick={onLoadMore}
              >
                <FaChevronDown /> Xem thêm&nbsp;
                {comment.totalChildren - commentList.length} trả lời
              </Button>
            )}
            <Button
              variant='ghost'
              type='button'
              className='max-640:text-[13px] max-520:text-xs flex h-5! items-center p-0! font-medium hover:bg-transparent hover:text-rose-500'
              onClick={onHideReplies}
            >
              <FaChevronUp /> Ẩn trả lời
            </Button>
          </div>
        ))}
    </>
  );
}
