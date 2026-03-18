import { Skeleton } from '@/components/ui/skeleton';

export default function MovieTabsSkeleton() {
  return (
    <div className='max-1120:px-5 max-800:px-0 flex flex-col gap-x-5 px-10'>
      <div className='max-800:justify-center max-480:justify-evenly max-420:justify-center max-640:gap-4 max-520:-mx-4 relative flex flex-nowrap gap-6 border-b border-solid pb-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`tab-skeleton-${index}`}
            className='skeleton max-640:px-3 max-520:px-2 max-480:px-1 max-640:text-[13px] max-520:text-xs h-8 w-24 px-4 py-3'
          />
        ))}
      </div>
      <div className='max-1120:pt-7.5 max-1120:pb-5 max-640:py-5 max-520:py-4 py-7.5'>
        <Skeleton className='skeleton mb-4 h-6 w-40' />
        <div className='grid grid-cols-6 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`tab-content-skeleton-${index}`}
              className='skeleton h-28 w-full'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
