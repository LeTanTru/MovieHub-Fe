import { cn } from '@/lib';
import { ReactNode } from 'react';

type CommentContentProps = {
  isBlurWholeContent: boolean;
  renderContent: () => ReactNode;
};

export function CommentContent({
  isBlurWholeContent,
  renderContent
}: CommentContentProps) {
  return (
    <p
      className={cn('max-640:text-[13px] mt-2 break-all', {
        'max-640:text-xs blur-xs select-none': isBlurWholeContent
      })}
    >
      {renderContent()}
    </p>
  );
}
