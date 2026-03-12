'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function WatchSkeleton() {
  return (
    <>
      {/* Watch Player Skeleton */}
      <div className='watch-player max-800:max-w-none max-800:w-full max-800:px-0 max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410 px-5'>
        <div className='max-1360:mb-4 max-1360:px-6 max-1120:px-4 max-800:mb-2 max-640:mt-4 max-640:mb-0 mb-6 inline-flex w-full items-center gap-2 px-8'>
          <Skeleton className='skeleton h-9 w-9 rounded-full' />
          <Skeleton className='skeleton h-7 w-64' />
        </div>
        <div className='watch-player-wrapper'>
          <div className='max-800:rounded-none relative aspect-video w-full overflow-hidden rounded-tl-[6px] rounded-tr-[6px] bg-black'>
            <Skeleton className='skeleton absolute inset-0 h-full w-full rounded-none!' />
          </div>
          <div className='player-controls bg-covert-black max-990:h-13.5 max-800:rounded-none flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
            <div className='max-1280:px-0 max-640:gap-0 max-640:px-0.5 max-1280:gap-0 max-520:px-4 max-520:gap-4 flex w-full items-center gap-2 px-4'>
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <Skeleton className='skeleton h-9 w-20' />
              <div className='grow'></div>
              <Skeleton className='skeleton h-9 w-20' />
            </div>
          </div>
        </div>
      </div>

      {/* Watch Container Skeleton */}
      <div className='max-1600:px-0 max-1120:flex-col relative z-2 mx-auto flex w-full max-w-410 items-stretch justify-between px-5'>
        {/* Watch Main Skeleton */}
        <div className='max-990:p-5 max-640:px-4 flex grow flex-col gap-10 p-7.5'>
          {/* WatchInfo Skeleton */}
          <div className='max-1280:hidden flex gap-6 border-b border-solid border-white/10 pb-10'>
            <div className='w-25 shrink-0'>
              <Skeleton className='skeleton mb-6 h-0 w-full pb-[150%]' />
            </div>
            <div className='w-110 shrink-0'>
              <Skeleton className='skeleton mb-2 h-6 w-3/4' />
              <Skeleton className='skeleton mb-3 h-5 w-1/2' />
              <div className='mb-3 flex gap-2'>
                <Skeleton className='skeleton h-6 w-12' />
                <Skeleton className='skeleton h-6 w-16' />
                <Skeleton className='skeleton h-6 w-20' />
              </div>
              <div className='mb-3 flex gap-2'>
                <Skeleton className='skeleton h-6 w-20' />
                <Skeleton className='skeleton h-6 w-24' />
              </div>
              <div className='mb-3 flex items-center justify-between'>
                <Skeleton className='skeleton h-5 w-32' />
                <Skeleton className='skeleton h-5 w-24' />
              </div>
              <div className='mb-3 flex items-center justify-between'>
                <Skeleton className='skeleton h-5 w-24' />
                <Skeleton className='skeleton h-5 w-24' />
              </div>
              <Skeleton className='skeleton h-5 w-40' />
            </div>
            <div className='grow pl-10'>
              <Skeleton className='skeleton mb-6 h-20 w-full' />
              <Skeleton className='skeleton h-5 w-28' />
            </div>
          </div>

          {/* WatchEpisode Skeleton */}
          <div>
            <div className='mb-4 flex gap-2'>
              <Skeleton className='skeleton h-8 w-24' />
              <Skeleton className='skeleton h-8 w-16' />
            </div>
            <div className='mb-4 flex gap-2'>
              <Skeleton className='skeleton h-10 w-20' />
              <Skeleton className='skeleton h-10 w-20' />
              <Skeleton className='skeleton h-10 w-20' />
              <Skeleton className='skeleton h-10 w-20' />
            </div>
          </div>

          {/* Discussion Skeleton */}
          <div className='max-1120:pb-0 px-0'>
            <Skeleton className='skeleton mb-4 h-7 w-32' />
            <Skeleton className='skeleton h-10 w-full' />
            <Skeleton className='skeleton mt-2 h-10 w-full' />
          </div>
        </div>

        {/* Watch Side Skeleton */}
        <div className='max-1360:w-95 max-1120:border-none max-1120:w-full max-1120:p-7.5 max-990:p-5 max-640:pt-0 flex w-110 shrink-0 flex-col gap-7.5 border-l border-solid border-white/10 p-10'>
          <div className='flex items-center justify-end gap-4'>
            <Skeleton className='skeleton h-9 w-28' />
            <Skeleton className='skeleton h-9 w-28' />
            <Skeleton className='skeleton h-9 w-28' />
          </div>

          {/* Actor List Skeleton */}
          <div className='border-t border-solid border-white/10 pt-7.5'>
            <Skeleton className='skeleton mb-8 h-6 w-24' />
            <div className='max-1120:grid-cols-6 max-640:grid-cols-3 max-800:grid-cols-5 max-480:grid-cols-2 max-640:text-[13px] max-520:text-xs grid grid-cols-3 gap-x-2.5 gap-y-6'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='flex flex-col items-center gap-3 text-center'
                >
                  <Skeleton className='skeleton h-20 w-20 rounded-full!' />
                  <Skeleton className='skeleton h-4 w-16' />
                </div>
              ))}
            </div>
          </div>

          {/* Suggestion List Skeleton */}
          <div className='border-t border-solid border-white/10 pt-7.5'>
            <Skeleton className='skeleton mb-4 h-7 w-40' />
            <div className='flex flex-col gap-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex gap-3'>
                  <Skeleton className='skeleton h-24 w-16 shrink-0' />
                  <div className='flex flex-1 flex-col gap-2'>
                    <Skeleton className='skeleton h-5 w-3/4' />
                    <Skeleton className='skeleton h-4 w-1/2' />
                    <Skeleton className='skeleton h-4 w-1/3' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
