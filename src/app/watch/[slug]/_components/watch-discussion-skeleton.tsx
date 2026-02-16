import { Skeleton } from '@/components/ui/skeleton';

export default function DiscussionSkeleton() {
  return (
    <div className='relative block px-10 py-5'>
      <div className='mb-4 flex items-center justify-between'>
        <Skeleton className='skeleton h-5 w-40 rounded!' />
        <Skeleton className='skeleton h-8 w-32 rounded!' />
      </div>
      <div className='mb-6'>
        <Skeleton className='skeleton mb-4 h-16 w-full rounded!' />
        <div className='mt-12 flex flex-col gap-8'>
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
    </div>
  );
}
