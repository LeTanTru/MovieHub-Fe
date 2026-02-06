import MovieTabs from './movie-tabs';
import MovieActionBar from './movie-action-bar';
import Discussion from './discussion';

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
