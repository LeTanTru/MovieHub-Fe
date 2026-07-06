import { SuggestionItem } from './suggestion-item';
import type { MovieResType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type SuggestionListProps = {
  movieList: MovieResType[];
};

export function SuggestionList({ movieList }: SuggestionListProps) {
  return (
    <div className='max-640:py-2 border-t border-solid border-white/10 py-4'>
      <div className='relative block'>
        <div className='mb-4 flex items-center gap-4 text-xl font-semibold text-white'>
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

SuggestionList.Skeleton = function SuggestionListSkeleton() {
  return (
    <div className='max-640:py-2 border-t border-solid border-white/10 py-4'>
      <Skeleton className='skeleton mb-4 h-7 w-40' />
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`suggestion-${index}`} className='flex gap-3'>
            <div className='w-16 shrink-0'>
              <div className='bg-gunmetal-blue relative block h-0 overflow-hidden rounded pb-[150%]'>
                <Skeleton className='skeleton absolute! top-0 left-0 size-full rounded!' />
              </div>
            </div>
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
