import { Skeleton } from '@/components/ui/skeleton';

export default function MovieSideSkeleton() {
  return (
    <div className='bg-main-background/60 max-1360:p-7.5 max-1360:w-95 max-1280:bg-transparent max-1280:backdrop-blur-none max-1280:p-0 max-1280:w-85 max-1120:w-full max-1120:mb-0 max-1120:text-center flex w-110 shrink-0 flex-col rounded-tl-[20px] rounded-tr-[48px] rounded-br-[20px] rounded-bl-[20px] p-10 backdrop-blur-[20px]'>
      <div className='max-1120:mx-auto mb-4 w-30'>
        <div className='bg-gunmetal-blue relative block h-0 w-full overflow-hidden rounded-md pb-[150%]'>
          <Skeleton className='skeleton absolute! top-0 left-0 size-full rounded-md!' />
        </div>
      </div>
      <Skeleton className='skeleton max-1120:mx-auto max-640:mb-1 mb-2 h-7 w-1/2' />
      <Skeleton className='skeleton max-1120:mx-auto max-1120:mb-4 max-1120:-mt-0.75 max-640:mb-3 mb-5 h-4 w-1/2' />
      <div className='max-1120:p-6 max-640:p-4 max-1120:rounded-md max-1120:bg-[rgba(0,0,0,.2)] max-1120:text-left'>
        {/* TagWrapper 1: Age rating, year, duration/episodes */}
        <div className='mb-3 flex flex-wrap items-center justify-start gap-2.5'>
          <Skeleton className='skeleton h-6.5 w-10 rounded!' />
          <Skeleton className='skeleton h-6.5 w-12 rounded border border-solid!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded border border-solid!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded border border-solid!' />
        </div>
        {/* TagWrapper 2: Categories */}
        <div className='mb-3 flex flex-wrap items-center justify-start gap-2.5'>
          <Skeleton className='skeleton h-6.5 w-16 rounded!' />
          <Skeleton className='skeleton h-6.5 w-14 rounded!' />
          <Skeleton className='skeleton h-6.5 w-12 rounded!' />
        </div>
        {/* MovieProgress skeleton */}
        <div className='mb-3'>
          <Skeleton className='skeleton h-8 w-36 rounded-4xl!' />
        </div>
        {/* Description */}
        <div className='mb-5'>
          <Skeleton className='skeleton mb-2 h-4 w-20' />
          <div className='flex flex-col gap-2'>
            <Skeleton className='skeleton h-4 w-full' />
            <Skeleton className='skeleton h-4 w-full' />
            <Skeleton className='skeleton h-4 w-3/4' />
          </div>
        </div>
        {/* Info rows */}
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-28 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-20 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-16 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-16 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
        <div className='max-1120:mb-0 mb-5 flex items-start gap-2'>
          <Skeleton className='skeleton h-4 w-14 shrink-0' />
          <Skeleton className='skeleton h-4 grow' />
        </div>
      </div>
      {/* ActorList skeleton - hidden on screens <= 1120px */}
      <div className='max-1120:hidden mb-5'>
        <h3 className='mb-8 text-xl font-medium text-white'>Diễn viên:</h3>
        <div className='grid grid-cols-3 gap-x-2.5 gap-y-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`actor-skeleton-${index}`}
              className='flex flex-col items-center gap-3 text-center'
            >
              <Skeleton className='skeleton h-20 w-20 rounded-full!' />
              <Skeleton className='skeleton h-4 w-16' />
            </div>
          ))}
        </div>
      </div>
      {/* TopViewList skeleton - hidden on screens <= 1120px */}
      <div className='max-1120:hidden border-t border-solid border-white/10 pt-8'>
        <div className='mb-4 flex min-h-10 items-center gap-4'>
          <Skeleton className='skeleton h-6 w-6 rounded!' />
          <Skeleton className='skeleton h-6 w-32' />
        </div>
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`top-view-skeleton-${index}`}
              className='flex items-center justify-between'
            >
              <Skeleton className='skeleton h-14 w-15 shrink-0' />
              <div className='flex grow items-center justify-between rounded bg-white/5 p-2.5'>
                <div className='w-20 shrink-0'>
                  <div className='bg-gunmetal-blue relative block h-0 w-full rounded pb-[150%]'>
                    <Skeleton className='skeleton absolute inset-0 h-full w-full rounded!' />
                  </div>
                </div>
                <div className='grow px-4'>
                  <Skeleton className='skeleton mb-1.5 h-4 w-3/4' />
                  <Skeleton className='skeleton mb-2 h-3 w-1/2' />
                  <div className='flex items-center gap-4'>
                    <Skeleton className='skeleton h-3 w-6' />
                    <Skeleton className='skeleton h-3 w-8' />
                    <Skeleton className='skeleton h-3 w-10' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
