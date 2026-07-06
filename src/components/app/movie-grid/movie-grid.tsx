import { MovieCard } from '@/components/app/movie-card';
import { cn } from '@/lib';
import type { MovieResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

type Dir = 'up' | 'down';

type MovieGridProps = {
  movieList: MovieResType[];
  dir?: Dir;
  className?: string;
};

export function MovieGrid({
  movieList,
  dir = 'up',
  className
}: MovieGridProps) {
  return (
    <div className={cn('grid w-full grow grid-cols-8 gap-6', className)}>
      <AnimatePresence mode='popLayout'>
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie} dir={dir} />
        ))}
      </AnimatePresence>
    </div>
  );
}

type MovieGridSkeletonProps = {
  className?: string;
  skeletonCount?: number;
};

MovieGrid.Skeleton = function MovieGridSkeleton({
  className,
  skeletonCount = 16
}: MovieGridSkeletonProps) {
  return (
    <div className={cn('grid w-full grid-cols-8 gap-6', className)}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <MovieCard.Skeleton key={index} />
      ))}
    </div>
  );
};
