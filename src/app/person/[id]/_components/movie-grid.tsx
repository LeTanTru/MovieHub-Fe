import MovieCard from '@/app/person/[id]/_components/movie-card';
import { MoviePersonResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

type Dir = 'up' | 'down';

export default function MovieGrid({
  moviePersonList,
  dir
}: {
  moviePersonList: MoviePersonResType[];
  dir: Dir;
}) {
  return (
    <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 grid grid-cols-6 gap-6 max-sm:grid-cols-3'>
      <AnimatePresence mode='popLayout' initial={false}>
        {moviePersonList &&
          moviePersonList.map((mp) => (
            <MovieCard key={mp.id} mp={mp} dir={dir} />
          ))}
      </AnimatePresence>
    </div>
  );
}
