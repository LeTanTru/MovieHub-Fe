'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TopicItemSkeleton() {
  return (
    <Skeleton className='topic-item skeleton max-1900:min-h-37.5 max-1280:min-h-35 max-800:min-h-30 max-480:min-h-22.5 max-480:shrink-0 max-480:w-30 min-h-37.5' />
  );
}
