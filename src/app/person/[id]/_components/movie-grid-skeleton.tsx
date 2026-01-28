'use client';

import { MovieCardSkeleton } from '@/components/app/movie-card';
import { AnimatePresence } from 'framer-motion';

export default function MovieGridSkeleton() {
  const skeletonCount = 24;
  return (
    <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 mt-4 grid grid-cols-8 gap-6 max-sm:grid-cols-3'>
      <AnimatePresence mode='popLayout' initial={false}>
        {Array.from({ length: skeletonCount * 3 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
