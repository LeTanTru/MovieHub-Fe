'use client';

import { MovieCardSkeleton } from '@/components/app/movie-card';
import { cn } from '@/lib';

export default function MovieGridSkeleton({
  className,
  skeletonCount = 16
}: {
  className?: string;
  skeletonCount?: number;
}) {
  return (
    <div className={cn('grid w-full grid-cols-8 gap-6', className)}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}
