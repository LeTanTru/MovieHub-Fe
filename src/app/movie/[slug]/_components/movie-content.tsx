import MovieTabs from './movie-tabs';
import MovieActorBar from './movie-action-bar';
import { MovieResType } from '@/types';

export default function MovieContent({ movie }: { movie: MovieResType }) {
  return (
    <div className='bg-main-background/60 flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <MovieActorBar movie={movie} />
      <MovieTabs />
    </div>
  );
}
