'use client';

import { MovieCardSkeleton } from '@/components/app/movie-card';
import { cn } from '@/lib';

type MovieGridSkeletonProps = {
  className?: string;
  skeletonCount?: number;
};

export default function MovieGridSkeleton({
  className,
  skeletonCount = 16
}: MovieGridSkeletonProps) {
  return (
    <div className={cn('grid w-full grid-cols-8 gap-6', className)}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}
