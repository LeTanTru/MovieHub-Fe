import { Skeleton } from '@/components/ui/skeleton';

export default function MovieSkeleton() {
  return (
    <div className='relative z-9 min-h-[calc(100vh-400px)] pt-0 pb-40'>
      <div className='relative z-3 mx-auto mb-0 flex w-full max-w-410 items-stretch justify-between px-5 py-0'>
        <Skeleton className='skeleton h-125 w-1/3 rounded-lg bg-gray-700' />
        <Skeleton className='skeleton ml-4 w-2/3'>
          <div className='mb-4 h-10 w-1/2 rounded bg-gray-700' />
          <div className='mb-2 h-6 w-3/4 rounded bg-gray-700' />
          <div className='mb-2 h-6 w-2/3 rounded bg-gray-700' />
          <div className='h-6 w-1/2 rounded bg-gray-700' />
        </Skeleton>
      </div>
    </div>
  );
}
