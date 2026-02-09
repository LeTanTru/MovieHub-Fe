import { MovieCard } from '@/components/app/movie-card';
import { cn } from '@/lib';
import { MovieResType } from '@/types';

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
    <div className={cn('grid w-full grow grid-cols-8 gap-6', className)}>
      {movieList.map((movie) => (
        <MovieCard key={movie.id} movie={movie} dir={dir} />
      ))}
    </div>
  );
}
