import { Skeleton } from '@/components/ui/skeleton';

export default function MovieTabsSkeleton() {
  return (
    <div className='flex flex-col gap-x-5 px-10'>
      <div className='flex flex-wrap gap-4 border-b border-solid pb-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`tab-skeleton-${index}`}
            className='skeleton h-8 w-24 rounded'
          />
        ))}
      </div>
      <div className='py-10'>
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
