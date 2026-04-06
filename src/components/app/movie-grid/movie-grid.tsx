import { MovieCard } from '@/components/app/movie-card';
import { cn } from '@/lib';
import { MovieResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

type Dir = 'up' | 'down';

type MovieGridProps = {
  movieList: MovieResType[];
  dir?: Dir;
  className?: string;
};

export default function MovieGrid({
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
