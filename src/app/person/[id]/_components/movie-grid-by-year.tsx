import MovieCard from '@/app/person/[id]/_components/movie-card';
import { cn } from '@/lib';
import { MoviePersonResType } from '@/types';
import { AnimatePresence } from 'framer-motion';

function groupByYear(list: MoviePersonResType[]) {
  return list.reduce((acc: Record<string, MoviePersonResType[]>, mp) => {
    const year = mp.movie.releaseDate?.split(' ')[0].split('/')[2];
    if (!year) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(mp);
    return acc;
  }, {});
}

export default function MovieGridByYear({
  moviePersonList
}: {
  moviePersonList: MoviePersonResType[];
}) {
  const grouped = groupByYear(moviePersonList);

  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year, index) => (
      <div
        key={year}
        className={cn(
          'max-1120:ml-0 max-1120:flex-col max-1120:justify-center max-1120:gap-4 max-800:gap-2 relative -ml-10 flex items-start justify-start',
          { 'max-1120:mt-4 mt-12': index > 0 }
        )}
      >
        <div className='before:bg-light-golden-yellow max-1120:h-auto max-1120:before:top-1 relative z-2 h-20 w-20 shrink-0 text-center font-semibold text-white before:absolute before:top-0 before:-left-1.25 before:h-2.5 before:w-2.5 before:rounded-full before:content-[""]'>
          <span className='max-1120:rotate-0 max-1120:justify-start max-1120:text-2xl max-1120:text-white max-1120:opacity-80 flex h-full w-full -rotate-90 items-center justify-end pl-4 text-[40px] font-black tracking-[3px] opacity-20'>
            {year}
          </span>
        </div>

        <div className='max-1120:grid-cols-5 max-1360:grid-cols-4 max-1600:grid-cols-5 max-1600:gap-4 max-480:grid-cols-2 max-800:grid-cols-4 relative z-3 grid w-full grow grid-cols-6 gap-6 gap-x-4 gap-y-6 max-sm:grid-cols-3'>
          <AnimatePresence mode='popLayout' initial={false}>
            {grouped[year].map((mp) => (
              <MovieCard key={mp.id} mp={mp} dir='up' />
            ))}
          </AnimatePresence>
        </div>
      </div>
    ));
}
