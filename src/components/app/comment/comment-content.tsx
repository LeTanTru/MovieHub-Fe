import { cn } from '@/lib';
import { CommentResType } from '@/types';
import { ReactNode } from 'react';

type CommentContentProps = {
  comment: CommentResType;
  isHiddenComment: boolean;
  showBlurredContent: boolean;
  onToggleBlurredContent: () => void;
  renderMention: () => ReactNode;
};

export function CommentContent({
  comment,
  isHiddenComment,
  showBlurredContent,
  onToggleBlurredContent,
  renderMention
}: CommentContentProps) {
  return (
    <div
      role='button'
      tabIndex={isHiddenComment && !showBlurredContent ? 0 : undefined}
      className={cn('max-640:text-[13px] relative mt-2 break-all text-white', {
        'cursor-pointer': isHiddenComment && !showBlurredContent
      })}
      onClick={
        isHiddenComment && !showBlurredContent
          ? onToggleBlurredContent
          : undefined
      }
      onKeyDown={
        isHiddenComment && !showBlurredContent
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleBlurredContent();
              }
            }
          : undefined
      }
    >
      <div
        className={cn({
          'max-640:text-[13px] blur-xs select-none':
            isHiddenComment && !showBlurredContent
        })}
      >
        {renderMention()}
        {comment.content}
      </div>
    </div>
  );
}
