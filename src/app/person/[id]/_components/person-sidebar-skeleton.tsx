import { Skeleton } from '@/components/ui/skeleton';

export default function PersonSidebarSkeleton({
  isMobile
}: {
  isMobile?: boolean;
}) {
  return (
    <div className='border-r-transparent-white max-1120:w-full max-1120:border-none max-1120:pr-0 max-1600:w-85 w-110 shrink-0 border-r pr-10'>
      {!isMobile && <Skeleton className='skeleton mb-4 h-10 w-10' />}

      <Skeleton className='skeleton mx-auto mb-6 h-40 w-40 rounded-full' />

      <Skeleton className='skeleton mx-auto mb-4 h-8 w-3/4' />

      <Skeleton className='skeleton mx-auto mb-4 h-5 w-2/3' />

      <div className='mb-4 flex justify-center gap-2'>
        <Skeleton className='skeleton h-9 w-28' />
        <Skeleton className='skeleton h-9 w-28' />
      </div>

      <div className='mb-2 flex gap-1'>
        <Skeleton className='skeleton h-5 w-20' />
        <Skeleton className='skeleton h-5 w-32' />
      </div>

      <div className='mb-2 flex gap-1'>
        <Skeleton className='skeleton h-5 w-20' />
        <Skeleton className='skeleton h-5 w-32' />
      </div>

      <Skeleton className='skeleton mb-2 h-5 w-24' />

      <div className='mb-4 space-y-2'>
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-5/6' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-4/5' />
        <Skeleton className='skeleton h-4 w-full' />
        <Skeleton className='skeleton h-4 w-3/4' />
      </div>

      <Skeleton className='skeleton max-1120:mx-auto max-1120:mb-4 max-1120:w-110 max-1600:mt-4 max-800:w-full mt-2 ml-auto block h-10 w-32' />
    </div>
  );
}
