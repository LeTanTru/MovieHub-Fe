import { Skeleton } from '@/components/ui/skeleton';

export default function DiscussionSkeleton() {
  return (
    <div className='max-1120:px-5 max-800:px-0 relative block px-10 py-5'>
      <div className='max-640:gap-2 mb-4 flex items-center gap-4 font-semibold text-white'>
        <Skeleton className='skeleton max-640:size-5 size-6 rounded!' />
        <Skeleton className='skeleton max-640:text-sm h-5 w-40 rounded!' />
      </div>
      <div className='max-640:my-3 max-520:mt-2 max-520:gap-2 my-4 flex items-center gap-4'>
        <Skeleton className='skeleton h-10 w-10 rounded-full!' />
        <div className='max-640:text-[13px] flex flex-col justify-between gap-1'>
          <Skeleton className='skeleton h-3 w-20 rounded!' />
          <Skeleton className='skeleton h-4 w-32 rounded!' />
        </div>
      </div>
      <Skeleton className='skeleton mb-4 h-16 w-full rounded!' />
      <div className='flex flex-col gap-8'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`discussion-skeleton-${index}`} className='flex gap-4'>
            <Skeleton className='skeleton h-12.5 w-12.5 rounded-full!' />
            <div className='flex grow flex-col gap-3'>
              <Skeleton className='skeleton h-4 w-40 rounded!' />
              <Skeleton className='skeleton h-4 w-full rounded!' />
              <Skeleton className='skeleton h-4 w-3/4 rounded!' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
