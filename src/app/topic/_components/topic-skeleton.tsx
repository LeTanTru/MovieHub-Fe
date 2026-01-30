'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TopicListSkeleton() {
  const skeletonCount = 21;

  return Array.from({ length: skeletonCount }).map((_, i) => (
    <TopicCardSkeleton key={i} />
  ));
}

function TopicCardSkeleton() {
  return <Skeleton className='skeleton h-37.5 w-full' />;
}
