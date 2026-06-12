import { cn } from '@/lib';
import { CommentResType } from '@/types';
import { ReactNode } from 'react';

type CommentContentProps = {
  comment: CommentResType;
  isHidden: boolean;
  showBlurredContent: boolean;
  onToggleBlurredContent: () => void;
  renderMention: () => ReactNode;
};

export function CommentContent({
  comment,
  isHidden,
  showBlurredContent,
  onToggleBlurredContent,
  renderMention
}: CommentContentProps) {
  return (
    <div
      role='button'
      tabIndex={isHidden && !showBlurredContent ? 0 : undefined}
      className={cn('max-640:text-[13px] relative mt-2 break-all text-white', {
        'cursor-pointer': isHidden && !showBlurredContent
      })}
      onClick={
        isHidden && !showBlurredContent ? onToggleBlurredContent : undefined
      }
      onKeyDown={
        isHidden && !showBlurredContent
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
            isHidden && !showBlurredContent
        })}
      >
        {renderMention()}
        {comment.content}
      </div>
    </div>
  );
}
