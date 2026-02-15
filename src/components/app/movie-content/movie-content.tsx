import { Discussion } from '@/components/app/discussion';
import { MovieActionBar } from '@/components/app/movie-action-bar';
import { MovieTabs } from '@/components/app/movie-tabs';

export default function MovieContent({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  return (
    <div className='bg-main-background/60 flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <MovieActionBar isLoading={isLoading} />
      <MovieTabs isLoading={isLoading} />
      <Discussion isLoading={isLoading} />
    </div>
  );
}
