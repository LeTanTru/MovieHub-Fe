import { SuggestionItem } from './suggestion-item';
import { MovieResType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type SuggestionListProps = {
  movieList: MovieResType[];
};

export function SuggestionList({ movieList }: SuggestionListProps) {
  return (
    <div className='border-t border-solid border-white/10 pt-7.5'>
      <div className='relative block'>
        <div className='mb-4 flex min-h-10 items-center gap-4 text-xl font-semibold text-white'>
          Đề xuất cho bạn
        </div>
        <div className='flex flex-col gap-4'>
          {movieList.map((movie) => (
            <SuggestionItem key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

SuggestionList.Skeleton = function () {
  return (
    <div className='border-t border-solid border-white/10 pt-7.5'>
      <Skeleton className='skeleton mb-4 h-7 w-40' />
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`suggestion-${index}`} className='flex gap-3'>
            <Skeleton className='skeleton h-24 w-16 shrink-0' />
            <div className='flex flex-1 flex-col gap-2'>
              <Skeleton className='skeleton h-5 w-3/4' />
              <Skeleton className='skeleton h-4 w-1/2' />
              <Skeleton className='skeleton h-4 w-1/3' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
