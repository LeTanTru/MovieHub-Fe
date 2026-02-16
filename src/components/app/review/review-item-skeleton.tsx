import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewItemSkeleton() {
  return (
    <div className='flex-start flex gap-4'>
      <Skeleton className='skeleton h-12.5 w-12.5 rounded-full!' />
      <div className='flex grow flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='skeleton h-4 w-20' />
          <Skeleton className='skeleton h-4 w-24' />
        </div>
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-3/4' />
        <div className='flex items-center gap-3'>
          <Skeleton className='skeleton h-4 w-10' />
          <Skeleton className='skeleton h-4 w-10' />
          <Skeleton className='skeleton h-4 w-14' />
        </div>
      </div>
    </div>
  );
}
