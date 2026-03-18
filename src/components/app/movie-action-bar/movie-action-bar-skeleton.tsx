import { Skeleton } from '@/components/ui/skeleton';

export default function MovieActionBarSkeleton() {
  return (
    <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
      <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
        <Skeleton className='skeleton max-640:h-12.5 max-800:min-w-55 max-640:min-w-44 h-15 w-44 rounded-4xl!' />
        <div className='max-800:gap-4 flex grow items-center justify-between'>
          <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`action-skeleton-${index}`}
                className='skeleton max-520:hidden:max-860:min-w-15 max-640:text-[13px] max-520:text-xs h-15 w-15 rounded-lg!'
              />
            ))}
          </div>
          <Skeleton className='skeleton max-640:min-w-32 h-12 w-45 rounded-4xl!' />
        </div>
      </div>
    </div>
  );
}
