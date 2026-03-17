import { Container } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieSkeleton() {
  return (
    <div className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
      <div className='relative h-0 w-full pb-[40%]'>
        <Skeleton className='skeleton absolute inset-0' />
      </div>
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <div className='max-1900:-mt-25 max-1120:flex-col max-1120:-mt-37.5 max-640:-mt-30 max-640:px-4 max-640:py-0 max-1120:flex-col relative z-3 mx-auto -mt-50 flex w-full max-w-410 items-stretch justify-between px-5'>
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
              <h3 className='mb-8 text-xl font-medium text-white'>
                Diễn viên:
              </h3>
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
                    className='flex items-center justify-between gap-2'
                  >
                    <Skeleton className='skeleton h-14 w-15 shrink-0' />
                    <div className='flex grow items-center justify-between rounded bg-white/5 p-2.5'>
                      <div className='w-20 shrink-0'>
                        <Skeleton className='skeleton h-full w-full rounded! pb-[150%]' />
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
          <div className='bg-main-background/60 max-1120:bg-transparent max-1120:rounded-none max-1120:backdrop-blur-none flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
            {/* Action bar */}
            <div className='max-1120:py-5 max-1120:px-4 max-800:px-0 max-520:pb-2.5 max-860:px-2.5 relative z-3 p-7.5'>
              <div className='max-1120:gap-6 max-990:gap-2 max-800:flex-col max-800:gap-4 flex items-center justify-between gap-8'>
                <Skeleton className='skeleton max-640:h-12.5 max-800:min-w-55 max-640:min-w-44 h-15 w-44 rounded-4xl!' />
                <div className='max-800:gap-4 flex grow items-center justify-between'>
                  <div className='max-1120:gap-2 max-800:gap-3 max-640:gap-2 flex grow items-center gap-4'>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton
                        key={`action-skeleton-${index}`}
                        className='skeleton max-520:hidden:max-860:min-w-15 max-640:text-[13px] max-520:text-xs h-15 w-15 rounded-lg!'
                      />
                    ))}
                  </div>
                  <Skeleton className='skeleton max-640:min-w-32 h-12 w-45 rounded-4xl!' />
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className='max-1120:px-5 max-800:px-0 flex flex-col gap-x-5 px-10'>
              <div className='max-800:justify-center max-480:justify-evenly max-420:justify-center max-640:gap-4 max-520:-mx-4 relative flex flex-nowrap gap-6 border-b border-solid pb-2'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={`tab-skeleton-${index}`}
                    className='skeleton max-640:px-3 max-520:px-2 max-480:px-1 max-640:text-[13px] max-520:text-xs h-8 w-24 px-4 py-3'
                  />
                ))}
              </div>
              <div className='max-1120:pt-7.5 max-1120:pb-5 max-640:py-5 max-520:py-4 py-7.5'>
                <Skeleton className='skeleton mb-4 h-6 w-40' />
                <div className='grid grid-cols-6 gap-4'>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={`tab-content-skeleton-${index}`}
                      className='skeleton h-28 w-full'
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Discussion */}
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
                  <div
                    key={`discussion-skeleton-${index}`}
                    className='flex gap-4'
                  >
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
        </div>
      </Container>
    </div>
  );
}
