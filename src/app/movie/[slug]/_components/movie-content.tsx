import MovieTabs from './movie-tabs';
import MovieActionBar from './movie-action-bar';

export default function MovieContent() {
  return (
    <div className='bg-main-background/60 flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <MovieActionBar />
      <MovieTabs />
    </div>
  );
}
