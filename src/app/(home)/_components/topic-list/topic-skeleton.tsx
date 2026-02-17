'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TopicListSkeleton({
  skeletonCount = 21
}: {
  skeletonCount?: number;
}) {
  return Array.from({ length: skeletonCount }).map((_, i) => (
    <TopicCardSkeleton key={i} />
  ));
}

function TopicCardSkeleton() {
  return <Skeleton className='skeleton h-37.5 w-full' />;
}
