import { Skeleton } from '@/components/ui/skeleton';

function PersonCardSkeleton() {
  return (
    <Skeleton className='skeleton m-0 h-0 w-full shrink-0 animate-pulse overflow-hidden rounded-none pb-[calc(100%+40px)]' />
  );
}

export default function PersonListSkeleton() {
  const skeletonCount = 24;

  return Array.from({ length: skeletonCount }).map((_, i) => (
    <PersonCardSkeleton key={i} />
  ));
}
