import { Container } from '@/components/layout';
import { DiscussionSkeleton } from '@/components/app/discussion';
import { MovieActionBarSkeleton } from '@/components/app/movie-action-bar';
import { MovieSideSkeleton } from '@/components/app/movie-side';
import { MovieTabsSkeleton } from '@/components/app/movie-tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieSkeleton() {
  return (
    <div className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
      <Skeleton className='skeleton pb-[40%]' />
      <Container className='relative z-9 min-h-[calc(100vh-400px)] pb-40'>
        <div className='max-1900:-mt-25 max-1120:flex-col max-1120:-mt-37.5 max-640:-mt-30 max-640:px-4 max-640:py-0 max-1120:flex-col relative z-3 mx-auto -mt-50 flex w-full max-w-410 items-stretch justify-between px-5'>
          <MovieSideSkeleton />
          <div className='bg-main-background/60 max-1120:bg-transparent max-1120:rounded-none max-1120:backdrop-blur-none flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
            <MovieActionBarSkeleton />
            <MovieTabsSkeleton />
            <DiscussionSkeleton />
          </div>
        </div>
      </Container>
    </div>
  );
}
