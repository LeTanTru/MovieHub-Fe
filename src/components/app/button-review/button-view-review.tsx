'use client';

import { StarIcon } from '@/assets';
import { Button } from '@/components/form';
import { DISCUSSION_TAB_REVIEW } from '@/constants';
import { useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { useMovieStore } from '@/store';
import { scroller } from 'react-scroll';
import { useShallow } from 'zustand/shallow';

export default function ButtonViewReview({
  to,
  className
}: {
  to: string;
  className?: string;
}) {
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
      className={cn(
        'hover:text-light-golden-yellow! h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10',
        className
      )}
      variant='ghost'
      onClick={() => handleSelectDiscussionTab(DISCUSSION_TAB_REVIEW)}
    >
      <StarIcon ref={iconRef} />
      Đánh giá
    </Button>
  );
}
