'use client';

import { MessageIcon } from '@/assets';
import { Button } from '@/components/form';
import { DISCUSSION_TAB_COMMENT } from '@/constants';
import { useClickAnimation, useDiscussionTab } from '@/hooks';
import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { scroller } from 'react-scroll';

const variants = cva(
  'hover:text-golden-glow h-fit min-w-20 flex-col px-2 hover:bg-white/10',
  {
    variants: {
      variant: {
        detail: '',
        watch: ''
      }
    },
    defaultVariants: { variant: 'detail' }
  }
);

type ButtonViewCommentProps = {
  to: string;
  className?: string;
} & VariantProps<typeof variants>;

export function ButtonViewComment({
  to,
  className,
  variant
}: ButtonViewCommentProps) {
  const { iconRef, startAnimation } = useClickAnimation();

  const { setDiscussionTab } = useDiscussionTab();

  const handleSelectDiscussionTab = (tab: string) => {
    startAnimation();
    setDiscussionTab(tab);
    scroller.scrollTo(to, {
      duration: 0,
      delay: 0,
      smooth: true,
      offset: -100,
      isDynamic: true
    });
  };

  return (
    <Button
      className={cn(variants({ variant }), className)}
      variant='ghost'
      onClick={() => handleSelectDiscussionTab(DISCUSSION_TAB_COMMENT)}
    >
      <MessageIcon ref={iconRef} />
      Bình luận
    </Button>
  );
}
