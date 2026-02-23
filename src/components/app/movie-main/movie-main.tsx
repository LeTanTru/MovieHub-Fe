import { Discussion } from '@/components/app/discussion';
import { MovieActionBar } from '@/components/app/movie-action-bar';
import { MovieTabs } from '@/components/app/movie-tabs';
import { MOVIE_DETAIL_DISCUSSION_ID } from '@/constants';

export default function MovieMain({
  isLoading = false
}: {
  isLoading?: boolean;
}) {
  return (
    <div className='bg-main-background/60 flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <MovieActionBar isLoading={isLoading} />
      <MovieTabs isLoading={isLoading} />
      <Discussion isLoading={isLoading} toId={MOVIE_DETAIL_DISCUSSION_ID} />
    </div>
  );
}
