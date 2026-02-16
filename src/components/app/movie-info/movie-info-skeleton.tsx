import { Skeleton } from '@/components/ui/skeleton';

export default function MovieInfoSkeleton() {
  return (
    <div className='bg-main-background/60 flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <Skeleton className='skeleton mb-4 h-52 w-40' />
      <Skeleton className='skeleton mb-2 h-6 w-1/2' />
      <Skeleton className='skeleton mb-5 h-4 w-1/2' />
      <div className='mb-2.5 flex gap-2.5'>
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
      </div>
      <div className='mb-2.5 flex gap-2.5'>
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
        <Skeleton className='skeleton h-6 w-16' />
      </div>
      <div className='mb-5'>
        <Skeleton className='skeleton h-8 w-3/4 rounded-full!' />
      </div>
      <div className='mb-5 flex flex-col gap-2'>
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-full' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4' />
        <Skeleton className='skeleton h-4 w-1/2' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4' />
        <Skeleton className='skeleton h-4 w-1/2' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4' />
        <Skeleton className='skeleton h-4 w-1/2' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4' />
        <Skeleton className='skeleton h-4 w-1/2' />
      </div>
      <div className='mb-5 flex gap-2'>
        <Skeleton className='skeleton h-4 w-1/4' />
        <Skeleton className='skeleton h-4 w-1/2' />
      </div>
      <div className='mb-5 grid grid-cols-3 gap-x-2.5 gap-y-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`actor-skeleton-${index}`}
            className='flex flex-col items-center gap-3'
          >
            <Skeleton className='skeleton h-20 w-20 rounded-full!' />
            <Skeleton className='skeleton h-4 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
}
