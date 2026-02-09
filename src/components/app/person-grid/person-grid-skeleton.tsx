import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib';
import { AnimatePresence } from 'framer-motion';

function PersonCardSkeleton() {
  return (
    <Skeleton className='skeleton m-0 h-0 w-full shrink-0 animate-pulse overflow-hidden rounded-none pb-[calc(100%+40px)]' />
  );
}

export default function PersonGridSkeleton({
  className,
  skeletonCount = 16
}: {
  className?: string;
  skeletonCount?: number;
}) {
  return (
    <div className={cn('grid w-full grid-cols-8 gap-6', className)}>
      <AnimatePresence mode='popLayout' initial={false}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PersonCardSkeleton key={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
