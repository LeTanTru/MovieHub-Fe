import { Discussion } from '@/components/app/discussion';
import { MOVIE_DETAIL_DISCUSSION_ID } from '@/constants';
import { MovieActionBar } from '@/components/app/movie-action-bar';
import { MovieTabs } from '@/components/app/movie-tabs';

export default function MovieMain() {
  return (
    <div className='bg-main-background/60 max-1120:bg-transparent max-1120:rounded-none max-1120:backdrop-blur-none flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <MovieActionBar />
      <MovieTabs />
      <Discussion toId={MOVIE_DETAIL_DISCUSSION_ID} />
    </div>
  );
}
