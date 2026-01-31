import { MovieCard } from '@/components/app/movie-card';
import { cn } from '@/lib';
import { MovieResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

type Dir = 'up' | 'down';

export default function MovieGrid({
  movieList,
  dir = 'up',
  className
}: {
  movieList: MovieResType[];
  dir?: Dir;
  className?: string;
}) {
  return (
    <div className={cn('grid grow grid-cols-8 gap-6', className)}>
      <AnimatePresence mode='popLayout' initial={false}>
        {movieList &&
          movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} dir={dir} />
          ))}
      </AnimatePresence>
    </div>
  );
}
