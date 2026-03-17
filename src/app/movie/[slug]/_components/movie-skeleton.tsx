import { MovieMain } from '@/components/app/movie-main';
import { MovieSide } from '@/components/app/movie-side';
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
          <MovieSide isLoading />
          <MovieMain isLoading />
        </div>
      </Container>
    </div>
  );
}
