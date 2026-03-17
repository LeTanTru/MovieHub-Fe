'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MovieCardSkeleton() {
  return (
    <div className='relative flex flex-col gap-3'>
      <Skeleton className='bg-gunmetal-blue skeleton relative block h-0 w-full overflow-hidden rounded-md! pb-[150%]'></Skeleton>

      <div className='min-h-10.5 text-center'>
        <Skeleton className='bg-gunmetal-blue skeleton mx-auto mb-2 h-5 w-20 rounded!'></Skeleton>
        <Skeleton className='bg-gunmetal-blue skeleton mx-auto h-5 w-20 rounded!'></Skeleton>
      </div>
    </div>
  );
}
