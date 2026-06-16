import { cn } from '@/lib';
import { ReactNode } from 'react';

type CommentContentProps = {
  canViewHiddenContent: boolean;
  isBlurWholeContent: boolean;
  onToggleBlurredContent: () => void;
  renderContent: () => ReactNode;
};

export function CommentContent({
  canViewHiddenContent,
  isBlurWholeContent,
  onToggleBlurredContent,
  renderContent
}: CommentContentProps) {
  const canToggleContent = canViewHiddenContent;

  return (
    <div
      role={canToggleContent ? 'button' : undefined}
      tabIndex={canToggleContent ? 0 : undefined}
      className={cn('max-640:text-[13px] relative mt-2 break-all text-white', {
        'cursor-pointer': canToggleContent
      })}
      onClick={canToggleContent ? onToggleBlurredContent : undefined}
      onKeyDown={
        canToggleContent
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
          'max-640:text-[13px] blur-xs select-none': isBlurWholeContent
        })}
      >
        {renderContent()}
      </div>
    </div>
  );
}
