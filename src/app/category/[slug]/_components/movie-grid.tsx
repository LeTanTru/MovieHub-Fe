import { MovieCard } from '@/components/app/movie-card';
import { MovieResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

type Dir = 'up' | 'down';

export default function MovieGrid({
  movieList,
  dir
}: {
  movieList: MovieResType[];
  dir: Dir;
}) {
  return (
    <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 mt-4 grid grid-cols-8 gap-6 max-sm:grid-cols-3'>
      <AnimatePresence mode='popLayout' initial={false}>
        {movieList &&
          movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} dir={dir} />
          ))}
      </AnimatePresence>
    </div>
  );
}
