import { Skeleton } from '@/components/ui/skeleton';

export default function CommentItemSkeleton() {
  return (
    <div className='flex justify-start gap-4'>
      <Skeleton className='skeleton h-12.5 w-12.5 rounded-full!' />
      <div className='flex grow flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='skeleton h-4 w-24 rounded!' />
          <Skeleton className='skeleton h-4 w-16 rounded!' />
        </div>
        <Skeleton className='skeleton h-4 w-full rounded!' />
        <Skeleton className='skeleton h-4 w-3/4 rounded!' />
        <div className='flex items-center gap-3'>
          <Skeleton className='skeleton h-4 w-10 rounded!' />
          <Skeleton className='skeleton h-4 w-10 rounded!' />
          <Skeleton className='skeleton h-4 w-14 rounded!' />
        </div>
      </div>
    </div>
  );
}
