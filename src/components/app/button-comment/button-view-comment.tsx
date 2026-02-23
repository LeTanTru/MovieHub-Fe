'use client';

import { MessageIcon } from '@/assets';
import { Button } from '@/components/form';
import { DISCUSSION_TAB_COMMENT } from '@/constants';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { cva, VariantProps } from 'class-variance-authority';
import { scroller } from 'react-scroll';
import { useShallow } from 'zustand/shallow';

const variants = cva(
  'hover:text-golden-glow h-fit min-w-20 flex-col px-2 hover:bg-white/10',
  {
    variants: {
      variant: {
        detail: 'text-xs',
        watch: 'text-sm'
      }
    },
    defaultVariants: { variant: 'detail' }
  }
);

export default function ButtonViewComment({
  to,
  className,
  variant
}: {
  to: string;
  className?: string;
} & VariantProps<typeof variants>) {
  const { iconRef, startAnimation } = useClickAnimation();

  const { setDiscussionTab } = useMovieStore(
    useShallow((s) => ({ setDiscussionTab: s.setDiscussionTab }))
  );

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
