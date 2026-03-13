'use client';

import { ButtonLike } from '@/components/app/button-like';
import { ButtonShareMovie } from '@/components/app/button-share';
import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import {
  ButtonAutoNextEpisode,
  ButtonMovieTheater,
  ButtonReport,
  ButtonSkipIntro,
  ButtonWatchTogether
} from '@/components/app/watch';
import { MovieResType } from '@/types';

type Props = {
  movie: MovieResType;
  autoNextEpisode: boolean;
  skipIntro: boolean;
  handleToggleAutoNextEpisode: () => void;
  handleToggleSkipIntro: () => void;
};

export default function WatchPlayerControls({
  movie,
  autoNextEpisode,
  skipIntro,
  handleToggleAutoNextEpisode,
  handleToggleSkipIntro
}: Props) {
  return (
    <div className='player-controls bg-covert-black max-990:h-13.5 max-800:rounded-none flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
      <div className='max-1280:px-0 max-640:gap-0 max-640:px-0.5 max-1280:gap-0 max-520:px-4 max-520:gap-4 flex w-full items-center gap-2 px-4 select-none'>
        <ButtonLike
          className='max-640:px-2! max-520:px-4!'
          targetId={movie.id}
          variant='watch'
          text='Yêu thích'
        />
        <ButtonAddToPlaylist
          className='max-640:px-2! max-520:px-4!'
          movieId={movie.id}
          variant='watch'
        />
        <ButtonAutoNextEpisode
          autoNextEpisode={autoNextEpisode}
          handleToggleAutoNextEpisode={handleToggleAutoNextEpisode}
          className='max-990:hidden'
        />
        <ButtonSkipIntro
          handleToggleSkipIntro={handleToggleSkipIntro}
          skipIntro={skipIntro}
          className='max-990:hidden'
        />
        <ButtonMovieTheater className='max-1120:hidden' />
        <div className='backdrop-movie-theater'></div>
        <ButtonShareMovie
          variant='watch'
          className='max-640:px-2! max-520:px-4!'
        />
        <ButtonWatchTogether className='max-640:px-2! max-520:px-4!' />
        <div className='grow'></div>
        <ButtonReport className='max-640:px-2! max-520:px-4!' />
      </div>
    </div>
  );
}
