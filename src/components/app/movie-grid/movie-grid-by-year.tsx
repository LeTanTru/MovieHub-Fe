import { MovieCard } from '@/components/app/movie-card';
import { cn } from '@/lib';
import { MovieResType } from '@/types';

function groupByYear(list: MovieResType[]) {
  return list.reduce((acc: Record<string, MovieResType[]>, movie) => {
    const year = movie.year;
    if (!year) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(movie);
    return acc;
  }, {});
}

export default function MovieGridByYear({
  movieList,
  className
}: {
  movieList: MovieResType[];
  className?: string;
}) {
  const grouped = groupByYear(movieList);

  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year, index) => (
      <div
        key={year}
        className={cn('relative -ml-10 flex items-start justify-start', {
          'max-1120:mt-4 mt-8': index > 0
        })}
      >
        <div className='before:bg-light-golden-yellow max-1120:h-auto max-1120:before:top-1 relative z-2 h-20 w-20 shrink-0 text-center font-semibold text-white before:absolute before:top-0 before:-left-1.25 before:h-2.5 before:w-2.5 before:rounded-full before:content-[""]'>
          <span className='max-1120:rotate-0 max-1120:justify-start max-1120:text-2xl max-1120:text-white max-1120:opacity-80 flex h-full w-full -rotate-90 items-center justify-end pl-4 text-[40px] font-black tracking-[3px] opacity-20'>
            {year}
          </span>
        </div>

        <div className={cn('grid grow grid-cols-6 gap-6', className)}>
          {grouped[year].map((movie) => (
            <MovieCard key={movie.id} movie={movie} dir='up' />
          ))}
        </div>
      </div>
    ));
}
