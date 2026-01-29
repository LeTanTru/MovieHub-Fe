'use client';

import { MovieCardSkeleton } from '@/components/app/movie-card';
import { cn } from '@/lib';
import { AnimatePresence } from 'framer-motion';

export default function MovieGridSkeleton({
  className
}: {
  className?: string;
}) {
  const skeletonCount = 24;
  return (
    <div className={cn('grid grid-cols-8 gap-6', className)}>
      <AnimatePresence mode='popLayout' initial={false}>
        {Array.from({ length: skeletonCount * 3 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
